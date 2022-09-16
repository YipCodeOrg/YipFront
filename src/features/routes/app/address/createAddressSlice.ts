import { ActionCreatorWithPayload, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useCallback } from "react"
import undoable from "redux-undo"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { Address, AliasMap } from "../../../../packages/YipStackLib/packages/YipAddress/types/address/address"
import { ParseOptions } from "../../../../packages/YipStackLib/packages/YipAddress/types/address/parseAddress"
import { UndoActionType } from "../../../../util/undo/undoActions"

type CreateAddressState = {
    addressName?: string,
    rawAddress: string,
    parseOptions: ParseOptions,
    address: Address | null
}

type AddressUpdateFunction = (address: Address) => Address

const initialState: CreateAddressState = {
    rawAddress: "",
    parseOptions: {},
    address: null
}

type PayloadWithFallback<T> = {
    obj: T,
    fallbackAddress: Address
}

export const createAddressSlice = createSlice({
    name: "createAddress",
    initialState: initialState,
    reducers: {
        setRawAddress(state: CreateAddressState, action: PayloadAction<string>){
            state.rawAddress = action.payload
        },
        setAddressLines(state: CreateAddressState, action: PayloadAction<PayloadWithFallback<string[]>>){                        
            updateAddress(state, function(address){
                return {
                    ...address,
                    addressLines: action.payload.obj
                }
            }, action.payload.fallbackAddress)
        },    
        setAliasMap(state: CreateAddressState, action: PayloadAction<PayloadWithFallback<AliasMap>>){
            updateAddress(state, function(address){
                return {
                    ...address,
                    aliasMap: action.payload.obj
                }
            }, action.payload.fallbackAddress)
        },
        setAddressName(state: CreateAddressState, action: PayloadAction<string>){
            const name = action.payload
            state.addressName = name
        },
        clearAddress(state: CreateAddressState){
            state.address = null
        },
        deleteAddressName(state: CreateAddressState){
            delete state.addressName
        }
    }
})

export const { setAddressLines, setAliasMap, setAddressName,
    deleteAddressName, clearAddress, setRawAddress } = createAddressSlice.actions

export const selectCreateAddress = (state: RootState) => state.createAddress

export const useCreateAddressState = () : CreateAddressState => {
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

export default undoable(createAddressSlice.reducer, {
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

function updateAddress(state: CreateAddressState, transform: AddressUpdateFunction, fallBackAddress: Address){                        
    state.address = transformAddress(state, transform, fallBackAddress)
}

function transformAddress(state: CreateAddressState, transform: AddressUpdateFunction, fallBackAddress: Address){                        
    const currentAddress = state.address      
    if(currentAddress !== null){
        return transform(currentAddress)
    } else {
        return transform(fallBackAddress)
    }
}