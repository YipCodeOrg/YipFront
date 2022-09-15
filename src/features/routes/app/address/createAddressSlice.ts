import { ActionCreatorWithPayload, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { Address, AliasMap } from "../../../../packages/YipStackLib/packages/YipAddress/core/address"
import { ParseOptions } from "../../../../packages/YipStackLib/packages/YipAddress/parse/parseAddress"

type CreateAddressState = {
    addressName?: string,
    parseOptions: ParseOptions,
    address: Address | null
}

type AddressUpdateFunction = (address: Address) => Address

const initialState: CreateAddressState = {
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
        deleteAddressName(state: CreateAddressState){
            delete state.addressName
        }
    }
})

export const { setAddressLines, setAliasMap, setAddressName, deleteAddressName } = createAddressSlice.actions

export const selectCreateAddress = (state: RootState) => state.createAddress

export const useCreateAddressState = () : CreateAddressState => {
    const addressState = useAppSelector(selectCreateAddress)
    return addressState
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

export default createAddressSlice.reducer

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