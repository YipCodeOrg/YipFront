import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { Address, AliasMap, emptyAddress } from "../../../../packages/YipStackLib/packages/YipAddress/core/address"
import { ParseOptions, parseStrToAddress } from "../../../../packages/YipStackLib/packages/YipAddress/parse/parseAddress"

type CreateAddressState = {
    rawInput: string,
    parseOptions: ParseOptions,
    changeBuffer: Address[]
}

type AddressUpdateFunction = (address: Address) => Address

const initialState: CreateAddressState = {
    rawInput: "",
    parseOptions: {},
    changeBuffer: [emptyAddress]
}

export const createAddressSlice = createSlice({
    name: "createAddress",
    initialState: initialState,
    reducers: {
        setRawAddress(state: CreateAddressState, action: PayloadAction<string>){
            if(areThereCreateAddressChanges(state)){
                throw new Error("Cannot update raw address while there are changes buffered.");                
            } else{
                const newRawAddress = action.payload
                const newAddress = parseStrToAddress(newRawAddress)
                state.rawInput = newRawAddress
                state.changeBuffer = [newAddress]
            }            
        },
        setAddressLines(state: CreateAddressState, action: PayloadAction<string[]>){
            updateAddress(state, function(address){
                return {
                    ...address,
                    addressLines: action.payload
                }
            })
        },    
        setAddressAliases(state: CreateAddressState, action: PayloadAction<AliasMap>){
            updateAddress(state, function(address){
                return {
                    ...address,
                    aliasMap: action.payload
                }
            })
        },     
        undo(state: CreateAddressState, action: PayloadAction<{count: number}>){
            const { count } = action.payload
            const changeBuffer = state.changeBuffer
            const spliceIndex = Math.max(changeBuffer.length - count, 1)
            changeBuffer.splice(spliceIndex)
        }
    }
})

export const { setRawAddress, setAddressLines, undo, setAddressAliases: setAliasMap } = createAddressSlice.actions

export const selectCreateAddress = (state: RootState) => state.createAddress

export const useCreateAddressState = () : CreateAddressState => {
    const addressState = useAppSelector(selectCreateAddress)
    return addressState
}

export const useCurrentCreateAddress = () : Address => {
    const addressState = useCreateAddressState()
    return getCurrentAddress(addressState)
}

export const useRawCreateAddress = () : string => {
    return useCreateAddressState().rawInput
}

export const useAreThereCreateAddressChanges = () : boolean => {
    const addressState = useCreateAddressState()
    return areThereCreateAddressChanges(addressState)
}

export const useCreateAddressChangeCount = () : number => {
    const addressState = useCreateAddressState()
    return getChangeCount(addressState)
}

export const useSetRawCreateAddress = () : (rawAddress: string) => void => {
    const dispatch = useAppDispatch()
    const callback = useCallback((rawAddress: string) => dispatch(setRawAddress(rawAddress)), [dispatch])
    return callback
}

export const useUpdateCreateAddressAliasMap = () : (updater: (aliases: AliasMap) => void) => void => {
    const dispatch = useAppDispatch()
    const currentAddressState = useCurrentCreateAddress()

    function callBackFunction(updater: (aliases: AliasMap) => void){
        const newMap = {...currentAddressState.aliasMap}
        updater(newMap)
        return dispatch(setAliasMap(newMap))
    }

    const callback = useCallback(callBackFunction, [dispatch, currentAddressState])
    return callback
}

export const useUpdateCreateAddressLines = () : (updater: (lines: string[]) => void) => void => {
    const dispatch = useAppDispatch()
    const currentAddressState = useCurrentCreateAddress()

    function callBackFunction(updater: (lines: string[]) => void){
        const newLines = [...currentAddressState.addressLines]        
        updater(newLines)
        return dispatch(setAddressLines(newLines))
    }

    const callback = useCallback(callBackFunction, [dispatch, currentAddressState])
    return callback
}

export const useUndoCreateAddressChange = () : (count: number) => void => {
    const dispatch = useAppDispatch()
    const callback = useCallback((count: number) => dispatch(undo({count})), [dispatch])
    return callback
}

export default createAddressSlice.reducer

function updateAddress(state: CreateAddressState, update: AddressUpdateFunction){                        
    const currentAddress = getCurrentAddress(state)
    const newAddress = update(currentAddress)
    state.changeBuffer.push(newAddress)
}

function areThereCreateAddressChanges(state: CreateAddressState){
    return getChangeCount(state) > 0
}

function getCurrentAddress(state: CreateAddressState): Address{
    const current = state.changeBuffer.slice(-1).pop()
    if(!!current){
        return current
    }
    throw new Error("Current state not found");    
}

function getChangeCount(state: CreateAddressState): number{
    return state.changeBuffer.length - 1
}