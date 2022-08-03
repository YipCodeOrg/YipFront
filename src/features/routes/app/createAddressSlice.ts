import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { Address, emptyAddress } from "../../../packages/YipAddress/core/address"
import { parseStrToAddress } from "../../../packages/YipAddress/parse/parseAddress"

const initialState: Address = emptyAddress

export const createAddressSlice = createSlice({
    name: "createAddress",
    initialState: initialState,
    reducers: {
        setRawAddress(_: Address, action: PayloadAction<string>){
            return parseStrToAddress(action.payload)
        }
    }
})

export const { setRawAddress } = createAddressSlice.actions

export const selectCreateAddress = (state: RootState) => state.createAddress

export const useCreateAddressState = () : [Address, (s: string) => void] => {
    const dispatch = useAppDispatch()
    const addressState = useAppSelector(selectCreateAddress)
    const callback = useCallback((s: string) => dispatch(setRawAddress(s)), [dispatch])
    return [addressState, callback]
}

export default createAddressSlice.reducer