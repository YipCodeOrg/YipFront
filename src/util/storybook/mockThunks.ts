import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { timeoutPromiseOf } from "../../packages/YipStackLib/packages/YipAddress/util/misc";

export function createMockApiRequestThunk<TThunkInput, TResponse>(mockedResponse: TResponse, 
    typePrefix: string, delayMilis: number = 1500)
    : AsyncThunk<TResponse, TThunkInput, {}> {
        return createAsyncThunk(typePrefix, async function(_: TThunkInput){
            return timeoutPromiseOf(mockedResponse, delayMilis)
        })        
}

