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
export type FetchThunkGenerator<TResponse, TReturn> = (path: string, isCorrectType: (obj: any) => obj is TResponse) => FetchThunk<TReturn>

export function fetchSliceGenerator<TResponse, TReturn>(objectType: string,
    boilerplateCastFunction: (t: TReturn) => Draft<TReturn>,
    path: string, isCorrectType: (obj: any) => obj is TResponse) {
    return function(extraReducersBuilder?: (b: ActionReducerMapBuilder<FetchSliceOf<TReturn>>) => ActionReducerMapBuilder<FetchSliceOf<TReturn>>){
            return function(thunkGenerator: FetchThunkGenerator<TResponse, TReturn>){

            const fetchThunk: FetchThunk<TReturn> = thunkGenerator(path, isCorrectType)

            const effectiveExtraReducersBuilder = liftUndefinedToNoOp(extraReducersBuilder)

            const extraReducers = compose2(addFetchThunkReducers<FetchSliceOf<TReturn>, MessagePort, TReturn>(
                (state, status) => state.loadStatus = status,
                (state, payload) => state.sliceData = boilerplateCastFunction(payload),
                fetchThunk), effectiveExtraReducersBuilder)

            return {
                slice: createSlice({
                name: `${objectType}/fetch`,
                initialState: initialSlice<TReturn>(),
                reducers: {},
                extraReducers
                }),
                thunk: fetchThunk            
            }
        }
    }
}