import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { timeoutPromiseOf } from "../../packages/YipStackLib/packages/YipAddress/util/misc";

export function createMockApiRequestThunk<TThunkInput, TResponse>(mockedResponse: TResponse, 
    typePrefix: string, delayMilis: number)
    : AsyncThunk<TResponse, TThunkInput, {}> {
        const thunk = createAsyncThunk(typePrefix, async function(_: TThunkInput){
            return await timeoutPromiseOf(mockedResponse, delayMilis)
        })
        return thunk
}
