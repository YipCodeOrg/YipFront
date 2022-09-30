import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { timeoutPromiseOf, timeoutRejectedPromiseOf } from "../../packages/YipStackLib/packages/YipAddress/util/misc";
import { PortBodyInput } from "../redux/thunkHelpers";

export function createMockApiRequestThunk<TThunkInput, TResponse>(mockedResponse: TResponse,
    typePrefix: string, delayMilis: number)
    : AsyncThunk<TResponse, TThunkInput, {}> {
    return createMockTransformedInputThunk(typePrefix, () => mockedResponse, delayMilis)
}

export function createMockFailureApiRequestThunk<TThunkInput, TResponse>(typePrefix: string, delayMilis: number)
    : AsyncThunk<TResponse, TThunkInput, {}> {
    const thunk = createAsyncThunk(typePrefix, async function (_: TThunkInput) {
        return await timeoutRejectedPromiseOf<TResponse>(delayMilis)
    })
    return thunk
}

// Transforms whatever input is passed to the thunk and returs transformed value
export function createMockTransformedInputThunk<TThunkInput, TResponse>(typePrefix: string,
    responseGenerator: (d: TThunkInput) => TResponse, delayMilis: number){        
    
        const thunk = createAsyncThunk(typePrefix, async function (input: TThunkInput) {
            const response = responseGenerator(input)
            return await timeoutPromiseOf(response, delayMilis)
        })
        return thunk
}

export function createMockTransformedPortBodyOrFailureThunk<TBody, TResponse>(typePrefix: string,
    responseGenerator: (d: TBody) => TResponse, delayMilis: number, shouldFail: boolean){
        if(shouldFail){
            return createMockFailureApiRequestThunk<PortBodyInput<TBody>, TResponse>(typePrefix, delayMilis)
        } else {
            return createMockTransformedPortBodyThunk<TBody, TResponse>(typePrefix, responseGenerator, delayMilis)
        }
}

export function createMockTransformedPortBodyThunk<TBody, TResponse>(typePrefix: string,
    responseGenerator: (d: TBody) => TResponse, delayMilis: number){        

        function liftedResponseGenerator(i: PortBodyInput<TBody>){
            return responseGenerator(i.body)
        }
    
        return createMockTransformedInputThunk(typePrefix, liftedResponseGenerator, delayMilis)
}

export function createMockPortBodyThunkOrFailureThunk<TData, TResponse>(typePrefix: string,
    data: TData | null, responseGenerator: (d: TData) => TResponse, delayMilis: number){
        return createMockThunkOrFailureThunk<TData, 
        PortBodyInput<TData>, TResponse>(typePrefix, data, responseGenerator, delayMilis)
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