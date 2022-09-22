import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { timeoutPromiseOf, timeoutRejectedPromiseOf } from "../../packages/YipStackLib/packages/YipAddress/util/misc";

export function createMockApiRequestThunk<TThunkInput, TResponse>(mockedResponse: TResponse,
    typePrefix: string, delayMilis: number)
    : AsyncThunk<TResponse, TThunkInput, {}> {
    const thunk = createAsyncThunk(typePrefix, async function (_: TThunkInput) {
        return await timeoutPromiseOf(mockedResponse, delayMilis)
    })
    return thunk
}

export function createMockFailureApiRequestThunk<TThunkInput, TResponse>(typePrefix: string, delayMilis: number)
    : AsyncThunk<TResponse, TThunkInput, {}> {
    const thunk = createAsyncThunk(typePrefix, async function (_: TThunkInput) {
        return await timeoutRejectedPromiseOf<TResponse>(delayMilis)
    })
    return thunk
}

/**
 * If the data is null, creates a failure thunk. Else creates a regular thunk.
 */
export function createMockThunkOrFailureThunk<TData, TThunkInput, TResponse>(typePrefix: string, data: TData | null,
    responseGenerator: (d: TData) => TResponse, delayMilis: number) {
    if (data === null) {
        return createMockFailureApiRequestThunk<TThunkInput, TResponse>(typePrefix, delayMilis)
    } else {
        const input = responseGenerator(data)
        return createMockApiRequestThunk<TThunkInput, TResponse>(input, typePrefix, delayMilis)
    }
}