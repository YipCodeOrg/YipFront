import { LoadStatus } from "../../../app/types"
import { addFetchThunkReducers } from "../reduxHelpers"
import { AsyncThunk, createSlice, Draft } from "@reduxjs/toolkit";

export type FetchSliceOf<T> = {
    sliceData?: T,
    loadStatus: LoadStatus
}

export function initialSlice<T>(): FetchSliceOf<T> {
    return { loadStatus: LoadStatus.NotLoaded }
}

export type FetchThunk<T> = AsyncThunk<T, MessagePort, {}>
export type FetchThunkGenerator<T> = (path: string, isCorrectType: (obj: any) => obj is T) => FetchThunk<T>

export function fetchSliceGenerator<T>(objectType: string, boilerplateCastFunction: (t: T) => Draft<T>,
    path: string, isCorrectType: (obj: any) => obj is T) {
    return (thunkGenerator: FetchThunkGenerator<T>) => {

        const fetchThunk: FetchThunk<T> = thunkGenerator(path, isCorrectType)

        return {
            slice: createSlice({
            name: `${objectType}/fetch`,
            initialState: initialSlice<T>(),
            reducers: {},
            extraReducers: addFetchThunkReducers<FetchSliceOf<T>, MessagePort, T>(
                (state, status) => state.loadStatus = status,
                (state, payload) => state.sliceData = boilerplateCastFunction(payload),
                fetchThunk),
            }),
            thunk: fetchThunk            
        }
    }
}