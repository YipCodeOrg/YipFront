import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit"
import { HttpStatusOk } from "../hubApi"
import { createApiRequest } from "./thunkHelpers"

type ThunkInputWithPort = {
    port: MessagePort
}

export type PortBodyThunkInput<TBody> = {
    body: TBody
} & ThunkInputWithPort

export type PortBodyThunk<TBody, TResponse> = AsyncThunk<TResponse, PortBodyThunkInput<TBody>, {}>

/** Note - this is intended for deletion where the API response returns an object descriptor.
 * For deletes that do not contain a descriptor in the response, a 204 resonse should be returned. */
export function createApiDeleteThunk<TBody, TResponse>(path: string,
    isCorrectType: (obj: any) => obj is TResponse): PortBodyThunk<TBody, TResponse> {
    return createPortBodyRequestThunk<TBody, TResponse>
        (path, isCorrectType, HttpStatusOk, "DELETE")
}

export function createApiPostThunk<TBody, TResponse>(path: string,
    isCorrectType: (obj: any) => obj is TResponse): PortBodyThunk<TBody, TResponse> {
    return createPortBodyRequestThunk<TBody, TResponse>
        (path, isCorrectType, HttpStatusOk, "POST")
}

export function createApiGetThunk<T>(path: string, isCorrectType: (obj: any) => obj is T) {    
    return createApiRequestThunk<MessagePort, T>(p => p, isCorrectType, HttpStatusOk, "GET", path)
}

export function createPortBodyRequestThunk<TBody, TResponse>(path: string,
    isCorrectType: (obj: any) => obj is TResponse, expectedStatus: number, method: string): PortBodyThunk<TBody, TResponse>{
        return createApiRequestThunk<PortBodyThunkInput<TBody>, TResponse, TBody>
            (p => p.port, isCorrectType, expectedStatus, method, path, i => i.body)
}

export function createApiRequestThunk<TThunkInput, TResponse, TBody={}>(
    getPort: (i: TThunkInput) => MessagePort,
    isResponseCorrectType: (obj: any) => obj is TResponse,    
    expectedStatus: number, method: string, path: string,    
    bodyGenerator?: (i: TThunkInput) => TBody) : AsyncThunk<TResponse, TThunkInput, {}> {

    const pathStartingWithForwardSlash = path.startsWith("/") ? path : `/${path}`
    const typePrefix = `request${pathStartingWithForwardSlash}/${method}`

    const asyncRequest = createApiRequest(getPort, isResponseCorrectType,
        expectedStatus, method, path, bodyGenerator)

    return createAsyncThunk(
        typePrefix,
        asyncRequest        
    )
}