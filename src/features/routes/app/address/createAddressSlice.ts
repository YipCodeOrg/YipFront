import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { Address, emptyAddress, shallowCopyUpdateLine } from "../../../../packages/YipStackLib/packages/YipAddress/core/address"
import { ParseOptions, parseStrToAddress } from "../../../../packages/YipStackLib/packages/YipAddress/parse/parseAddress"

type CreateAddressState = {
    rawInput: string,
    parseOptions: ParseOptions,
    changeBuffer: Address[]
}

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
            if(isRawInputLocked(state)){
                throw new Error("Cannot update raw address. Raw input is locked.");                
            } else{
                const newRawAddress = action.payload
                const newAddress = parseStrToAddress(newRawAddress)
                state.rawInput = newRawAddress
                state.changeBuffer = [newAddress]
            }            
        },
        updateLine(state: CreateAddressState, action: PayloadAction<{index: number, content: string}>){
            const {index, content} = action.payload
            const currentAddress = getCurrentAddress(state)
            const newAddress = shallowCopyUpdateLine(currentAddress, index, content)
            state.changeBuffer.push(newAddress)
        }
    }
})

function isRawInputLocked(state: CreateAddressState){
    return state.changeBuffer.length > 1
}

function getCurrentAddress(state: CreateAddressState): Address{
    const current = state.changeBuffer.slice(-1).pop()
    if(!!current){
        return current
    }
    throw new Error("Current state not found");    
}

export const { setRawAddress, updateLine } = createAddressSlice.actions

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

export const useIsRawCreateAddresInputLocked = () : boolean => {
    const addressState = useCreateAddressState()
    return isRawInputLocked(addressState)
}

export const useSetRawCreateAddress = () : (rawAddress: string) => void => {
    const dispatch = useAppDispatch()
    const callback = useCallback((rawAddress: string) => dispatch(setRawAddress(rawAddress)), [dispatch])
    return callback
}

export const useSetCreateAddressLine = () : (index: number, content: string) => void => {
    const dispatch = useAppDispatch()
    const callback = useCallback((index: number, content: string) => dispatch(updateLine({index, content})), [dispatch])
    return callback
}

export default createAddressSlice.reducer