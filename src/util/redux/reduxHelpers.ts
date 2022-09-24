import { ActionReducerMapBuilder, AsyncThunk, Draft } from "@reduxjs/toolkit"
import { LoadStatus as FetchStatus } from "../../app/types"

export function addFetchThunkReducers<TState, TThunkInput, TResponse>
    (statusSetter: (state: Draft<TState>, status: FetchStatus) => void,
    payloadSetter: (state: Draft<TState>, p: TResponse) => void,
    thunk: AsyncThunk<TResponse, TThunkInput, {}>){
                
    return function(builder: ActionReducerMapBuilder<TState>){
        builder.addCase(thunk.pending, (state) => {
            statusSetter(state, FetchStatus.Pending)
        })
        .addCase(thunk.rejected, (state) => {
            statusSetter(state, FetchStatus.Failed)
        })
        .addCase(thunk.fulfilled, (state, action) => {
            statusSetter(state, FetchStatus.Loaded)
            payloadSetter(state, action.payload)
        })
        return builder
    }
}