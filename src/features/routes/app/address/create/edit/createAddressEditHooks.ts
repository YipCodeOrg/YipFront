import { ActionCreatorWithPayload } from "@reduxjs/toolkit"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks"
import { Address, AliasMap } from "../../../../../../packages/YipStackLib/packages/YipAddress/types/address/address"
import { selectCreateAddress } from "./createAddressEditSelectors"
import { CreateAddressEditState, deleteAddressName, PayloadWithFallback, setAddressLines, setAddressName, setAliasMap, setRawAddress } from "./createAddressEditSlice"

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