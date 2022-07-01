import { ActionReducerMapBuilder, AsyncThunk, Draft } from "@reduxjs/toolkit"
import { LoadStatus } from "../app/types"

export const addStandardThunkReducers = <TState, TPayload>
    (statusSetter: (state: Draft<TState>, status: LoadStatus) => void,
    payloadSetter: (sate: Draft<TState>, p: TPayload) => void,
    thunk: AsyncThunk<TPayload, MessagePort, {}>) => 
    (builder: ActionReducerMapBuilder<TState>) => {
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