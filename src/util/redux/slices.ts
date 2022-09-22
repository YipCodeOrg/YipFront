import { LoadStatus } from "../../app/types"
import { addStandardThunkReducers } from "./reduxHelpers"
import { AsyncThunk, createSlice, Draft } from "@reduxjs/toolkit";

export type FetchSliceOf<T> = {
    sliceData?: T,
    loadStatus: LoadStatus
}

export function initialSlice<T>(): FetchSliceOf<T> {
    return { loadStatus: LoadStatus.NotLoaded }
}

export function createFetchSlice<T>(objectType: string, boilerplateCastFunction: (t: T) => Draft<T>) {
    return (fetchThunk: AsyncThunk<T, MessagePort, {}>) => {
        return createSlice({
            name: `${objectType}/fetch`,
            initialState: initialSlice<T>(),
            reducers: {},
            extraReducers: addStandardThunkReducers<FetchSliceOf<T>, T>(
                (state, status) => state.loadStatus = status,
                (state, payload) => state.sliceData = boilerplateCastFunction(payload),
                fetchThunk),
        })
    }
}