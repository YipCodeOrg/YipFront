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

export function createFetchSlice<T>(name: string, loadSlice: AsyncThunk<T, MessagePort, {}>,
    boilerplateCastFunction: (t: T) => Draft<T>) {
    return createSlice({
        name,
        initialState: initialSlice<T>(),
        reducers: {},
        extraReducers: addStandardThunkReducers<FetchSliceOf<T>, T>(
            (state, status) => state.loadStatus = status,
            (state, payload) => state.sliceData = boilerplateCastFunction(payload),
            loadSlice),
    })
}




