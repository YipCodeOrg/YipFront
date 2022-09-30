import { ActionCreatorWithPayload, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useCallback } from "react"
import undoable from "redux-undo"
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks"
import { RootState } from "../../../../../../app/store"
import { Address, AliasMap } from "../../../../../../packages/YipStackLib/packages/YipAddress/types/address/address"
import { ParseOptions } from "../../../../../../packages/YipStackLib/packages/YipAddress/types/address/parseAddress"
import { UndoActionType } from "../../../../../../util/undo/undoActions"

type CreateAddressEditState = {
    addressName?: string,
    rawAddress: string,
    parseOptions: ParseOptions,
    address: Address | null
}

type AddressUpdateFunction = (address: Address) => Address

const initialState: CreateAddressEditState = {
    rawAddress: "",
    parseOptions: {},
    address: null
}

type PayloadWithFallback<T> = {
    obj: T,
    fallbackAddress: Address
}

export const createAddressEditSlice = createSlice({
    name: "createAddress/edit",
    initialState,
    reducers: {
        setRawAddress(state: CreateAddressEditState, action: PayloadAction<string>){
            state.rawAddress = action.payload
        },
        setAddressLines(state: CreateAddressEditState, action: PayloadAction<PayloadWithFallback<string[]>>){                        
            updateAddress(state, function(address){
                return {
                    ...address,
                    addressLines: action.payload.obj
                }
            }, action.payload.fallbackAddress)
        },    
        setAliasMap(state: CreateAddressEditState, action: PayloadAction<PayloadWithFallback<AliasMap>>){
            updateAddress(state, function(address){
                return {
                    ...address,
                    aliasMap: action.payload.obj
                }
            }, action.payload.fallbackAddress)
        },
        setAddressName(state: CreateAddressEditState, action: PayloadAction<string>){
            const name = action.payload
            state.addressName = name
        },
        clearAddress(state: CreateAddressEditState){
            state.address = null
        },
        deleteAddressName(state: CreateAddressEditState){
            delete state.addressName
        }
    }
})

export const { setAddressLines, setAliasMap, setAddressName,
    deleteAddressName, clearAddress, setRawAddress } = createAddressEditSlice.actions

export const selectCreateAddress = (state: RootState) => state.createAddressEdit

export const useCreateAddressState = () : CreateAddressEditState => {
    const addressState = useAppSelector(selectCreateAddress)
    return addressState.present
}

export function useRawAddress() : [string, (s: string) => void]{
    const addressState = useCreateAddressState()
    const dispatch = useAppDispatch()
    const rawAddress = addressState.rawAddress
    const setter = useCallback(function(s: string){
        dispatch(setRawAddress(s))
    }, [dispatch])
    return [rawAddress, setter]
}


export function useCreateAddressHistoryLength(){
    const addressState = useAppSelector(selectCreateAddress)
    return addressState.past.length
}

export const useCurrentCreateAddress = () : Address | null => {
    const addressState = useCreateAddressState()
    return addressState.address
}

type CreateAddressNameState = {
    name: string | undefined,
    setName: (n: string) => void,
    deleteName: () => void
}

export function useCreateAddressName(): CreateAddressNameState{
    const addressState = useCreateAddressState()
    const dispatch = useAppDispatch()
    const setCallback = useCallback((name: string) => dispatch(setAddressName(name)), [dispatch])
    const deleteCallback = useCallback(() => dispatch(deleteAddressName()), [dispatch])
    return {
        name: addressState.addressName,
        setName: setCallback,
        deleteName: deleteCallback
    }
}

export function useUpdateCreateAddressLines(fallbackAddress: Address)
: (updater: (lines: string[]) => void) => void{
    return useUpdateAddressAndDispatch(setAddressLines, a => a.addressLines, fallbackAddress,
        l => [...l])
}

export function useUpdateCreateAddressAliasMap(fallbackAddress: Address)
: (updater: (aliases: AliasMap) => void) => void{
    return useUpdateAddressAndDispatch(setAliasMap, a => a.aliasMap, fallbackAddress,
        m => {return {...m}})
}

export default undoable(createAddressEditSlice.reducer, {
    undoType: UndoActionType.UndoCreateAddress,
    clearHistoryType: UndoActionType.ClearCreateAddress
})

function useUpdateAddressAndDispatch<T>(payloadCreator: ActionCreatorWithPayload<PayloadWithFallback<T>>,
    prop: (a: Address) => T, fallbackAddress: Address, copy: (t: T) => T){
    const dispatch = useAppDispatch()
    const currentAddress = useCurrentCreateAddress()
    
    function callBackFunction(updater: (t: T) => void){
        const sourceAddress = currentAddress ?? fallbackAddress
        const propCopy = copy(prop(sourceAddress))        
        updater(propCopy)        
        const payloadWithFallback: PayloadWithFallback<T> = {
            obj: propCopy,
            fallbackAddress
        }
        return dispatch(payloadCreator(payloadWithFallback))
    }

    const callback = useCallback(callBackFunction, [dispatch, currentAddress,
        fallbackAddress, prop, copy])
    return callback
}

function updateAddress(state: CreateAddressEditState, transform: AddressUpdateFunction, fallBackAddress: Address){                        
    state.address = transformAddress(state, transform, fallBackAddress)
}

function transformAddress(state: CreateAddressEditState, transform: AddressUpdateFunction, fallBackAddress: Address){                        
    const currentAddress = state.address      
    if(currentAddress !== null){
        return transform(currentAddress)
    } else {
        return transform(fallBackAddress)
    }
}