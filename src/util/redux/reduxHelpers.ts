import { ActionReducerMapBuilder, AsyncThunk, Draft } from "@reduxjs/toolkit"
import { LoadStatus } from "../../app/types"

export function addStandardThunkReducers<TState, TThunkInput, TResponse>
    (statusSetter: (state: Draft<TState>, status: LoadStatus) => void,
    payloadSetter: (state: Draft<TState>, p: TResponse) => void,
    thunk: AsyncThunk<TResponse, TThunkInput, {}>){
                
    return function(builder: ActionReducerMapBuilder<TState>){
        builder.addCase(thunk.pending, (state) => {
            statusSetter(state, LoadStatus.Pending)
        })
        .addCase(thunk.rejected, (state) => {
            statusSetter(state, LoadStatus.Failed)
        })
        .addCase(thunk.fulfilled, (state, action) => {
            statusSetter(state, LoadStatus.Loaded)
            payloadSetter(state, action.payload)
        })
        return builder
    }
}