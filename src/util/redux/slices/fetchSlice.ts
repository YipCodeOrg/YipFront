import { LoadStatus } from "../../../app/types"
import { addFetchThunkReducers } from "../reduxHelpers"
import { ActionReducerMapBuilder, AsyncThunk, createSlice, Draft } from "@reduxjs/toolkit";
import { compose2, liftUndefinedToNoOp } from "../../../packages/YipStackLib/packages/YipAddress/util/misc";

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
    path: string, isCorrectType: (obj: any) => obj is T,
    extraReducersBuilder?: (b: ActionReducerMapBuilder<FetchSliceOf<T>>) => ActionReducerMapBuilder<FetchSliceOf<T>>) {
    return (thunkGenerator: FetchThunkGenerator<T>) => {

        const fetchThunk: FetchThunk<T> = thunkGenerator(path, isCorrectType)

        const effectiveExtraReducersBuilder = liftUndefinedToNoOp(extraReducersBuilder)

        const extraReducers = compose2(addFetchThunkReducers<FetchSliceOf<T>, MessagePort, T>(
            (state, status) => state.loadStatus = status,
            (state, payload) => state.sliceData = boilerplateCastFunction(payload),
            fetchThunk), effectiveExtraReducersBuilder)

        return {
            slice: createSlice({
            name: `${objectType}/fetch`,
            initialState: initialSlice<T>(),
            reducers: {},
            extraReducers
            }),
            thunk: fetchThunk            
        }
    }
}