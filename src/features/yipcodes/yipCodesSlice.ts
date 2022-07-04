import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { LoadStatus } from "../../app/types";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useAsyncHubLoad } from "../../app/hooks";
import { addStandardThunkReducers } from "../../util/reduxHelpers";

type YipCodesSliceState = {
    yipCodes: string[],
    yipCodesLoadStatus: LoadStatus
}

const initialState: YipCodesSliceState = {
    yipCodes: [],
    yipCodesLoadStatus: LoadStatus.NotLoaded
}

export const loadYipCodes = createAsyncThunk(
    "yipcodes/load",
    //TODO: Add & use generic Hub API functionality to send over REST request    
    async (toHubPort: MessagePort) => {
        const mockResponse = ["Hello", "World"]
        return new Promise<string[]>(resolve => setTimeout(() => resolve(mockResponse), 1000))
    }
)

export const yipCodesSlice = createSlice({
    name: "yipCodes",
    initialState,
    reducers: {},
    extraReducers: addStandardThunkReducers(
        (state, payload) => state.yipCodesLoadStatus = payload,
        (state, status) => state.yipCodes = status,
        loadYipCodes),
})

export const selectYipCodes = (state: RootState) => state.yipCodes.yipCodes
export const selectYipCodesStatus = (state: RootState) => state.yipCodes.yipCodesLoadStatus

export const useYipCodesHubLoad = () => useAsyncHubLoad(loadYipCodes, selectYipCodes, selectYipCodesStatus)  

export default yipCodesSlice.reducer