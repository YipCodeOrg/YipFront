import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"

export type CreateAddressState = {
    rawAddress: string
}

const initialState: CreateAddressState = {
    rawAddress: ''
}

export const createAddressSlice = createSlice({
    name: "createAddress",
    initialState: initialState,
    reducers: {
        setRawAddress(state: CreateAddressState, action: PayloadAction<string>){
            state.rawAddress = action.payload
        }
    }
})

export const { setRawAddress } = createAddressSlice.actions

export const selectCreateAddress = (state: RootState) => state.createAddress

export const useCreateAddressState = () : [CreateAddressState, (s: string) => void] => {
    const dispatch = useAppDispatch()
    const addressState = useAppSelector(selectCreateAddress)
    const callback = useCallback((s: string) => dispatch(setRawAddress(s)), [dispatch])
    return [addressState, callback]
}

export default createAddressSlice.reducer