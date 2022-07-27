import { LoadStatus } from "../app/types"
import { addStandardThunkReducers } from "./reduxHelpers"
import { AsyncThunk, createSlice, Draft } from "@reduxjs/toolkit";

export type SliceOf<T> = {
    sliceData?: T,
    loadStatus: LoadStatus
}

export function initialSlice<T>(): SliceOf<T> {
    return {loadStatus: LoadStatus.NotLoaded}
}

export function createStandardSlice<T>(name: string, loadSlice: AsyncThunk<T, MessagePort, {}>,
    boilerplateCastFunction: (t: T) => Draft<T>){        
    return createSlice({
        name,
        initialState: initialSlice<T>(),
        reducers: {},
        extraReducers: addStandardThunkReducers<SliceOf<T>, T>(
            (state, status) => state.loadStatus = status,
            (state, payload) => state.sliceData = boilerplateCastFunction(payload),
            loadSlice),
    })
}
