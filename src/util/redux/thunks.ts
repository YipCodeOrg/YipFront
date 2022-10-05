import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit"
import HttpStatusCode from "../../packages/YipStackLib/packages/YipAddress/util/httpStatusCode"
import { createApiRequest, PortBodyInput } from "./thunkHelpers"

export type PortBodyThunk<TBody, TResponse> = AsyncThunk<TResponse, PortBodyInput<TBody>, {}>

export function createSimpleApiDeleteThunk<TBody, TResponse>(path: string,
    isCorrectType: (obj: any) => obj is TResponse): PortBodyThunk<TBody, TResponse> {
    return createApiDeleteThunk<TBody, TResponse, TResponse>
        (path, isCorrectType, r => r)
}

/** Note - this is intended for deletion where the API response returns an object descriptor.
 * For deletes that do not contain a descriptor in the response, a 204 resonse should be returned. */
export function createApiDeleteThunk<TBody, TResponse, TReturn>(path: string,
    isCorrectType: (obj: any) => obj is TResponse,
    responseTransform: (_: TResponse) => TReturn): PortBodyThunk<TBody, TReturn> {
    return createPortBodyRequestThunk<TBody, TResponse, TReturn>
        (path, isCorrectType, HttpStatusCode.OK, "DELETE", responseTransform)
}

export function createSimpleApiPutThunk<TBody, TResponse>(path: string,
    isCorrectType: (obj: any) => obj is TResponse){
    return createApiPutThunk<TBody, TResponse, TResponse>(path, isCorrectType, r => r)
}

/* Note - if PUT creates something, then it should really return a 201 response.
This assumes the PUT is an overwrite */
export function createApiPutThunk<TBody, TResponse, TReturn>(path: string,
    isCorrectType: (obj: any) => obj is TResponse,
    responseTransform: (_: TResponse) => TReturn): PortBodyThunk<TBody, TReturn> {
    return createPortBodyRequestThunk<TBody, TResponse, TReturn>
        (path, isCorrectType, HttpStatusCode.OK, "PUT", responseTransform)
}

export function createSimpleApiPostThunk<TBody, TResponse>(path: string,
    isCorrectType: (obj: any) => obj is TResponse){
    return createApiPostThunk<TBody, TResponse, TResponse>(path, isCorrectType, r => r)
}

export function createApiPostThunk<TBody, TResponse, TReturn>(path: string,
    isCorrectType: (obj: any) => obj is TResponse,
    responseTransform: (_: TResponse) => TReturn): PortBodyThunk<TBody, TReturn> {
    return createPortBodyRequestThunk<TBody, TResponse, TReturn>
        (path, isCorrectType, HttpStatusCode.OK, "POST", responseTransform)
}

export function createSimpleApiGetThunk<TResponse>(path: string, isCorrectType: (obj: any) => obj is TResponse) {    
    return createApiGetThunk<TResponse, TResponse>(path, isCorrectType, r => r)
}

export function createApiGetThunk<TResponse, TReturn>(path: string, isCorrectType: (obj: any) => obj is TResponse,
responseTransform: (_: TResponse) => TReturn) {    
    return createApiRequestThunk<MessagePort, TResponse, TReturn>(p => p, 
        isCorrectType, HttpStatusCode.OK, "GET", path, responseTransform)
}

export function createSimplePortBodyRequestThunk<TBody, TResponse>(path: string,
    isCorrectType: (obj: any) => obj is TResponse, expectedStatus: number, method: string): PortBodyThunk<TBody, TResponse>{
        return createPortBodyRequestThunk(path, isCorrectType, expectedStatus, method, r => r)
}

export function createPortBodyRequestThunk<TBody, TResponse, TReturn>(path: string,
    isCorrectType: (obj: any) => obj is TResponse, expectedStatus: number, method: string,
    responseTransform: (_: TResponse) => TReturn): PortBodyThunk<TBody, TReturn>{
        return createApiRequestThunk<PortBodyInput<TBody>, TResponse, TReturn, TBody>
            (p => p.port, isCorrectType, expectedStatus, method, path, responseTransform, i => i.body)
}

export function createSimpleApiRequestThunk<TThunkInput, TResponse, TBody={}>(
    getPort: (i: TThunkInput) => MessagePort,
    isResponseCorrectType: (obj: any) => obj is TResponse,    
    expectedStatus: number, method: string, path: string,
    bodyGenerator?: (i: TThunkInput) => TBody)
     : AsyncThunk<TResponse, TThunkInput, {}>{

    return createApiRequestThunk(getPort, isResponseCorrectType, 
        expectedStatus, method, path, r => r, bodyGenerator)
}

export function createApiRequestThunk<TThunkInput, TResponse, TReturn, TBody={}>(
    getPort: (i: TThunkInput) => MessagePort,
    isResponseCorrectType: (obj: any) => obj is TResponse,    
    expectedStatus: number, method: string, basePath: string,
    responseTransform: (_: TResponse) => TReturn,    
    bodyGenerator?: (i: TThunkInput) => TBody,
    augmentPath: (i: TThunkInput, path: string) => string = (_, p) => p)
     : AsyncThunk<TReturn, TThunkInput, {}>{

    const basePathStartingWithForwardSlash = basePath.startsWith("/") ? basePath : `/${basePath}`
    const typePrefix = `request${basePathStartingWithForwardSlash}/${method}`

    function generatePath(i: TThunkInput) : string{
        return augmentPath(i, basePath)
    }

    const asyncRequest = createApiRequest(getPort, isResponseCorrectType,
        expectedStatus, method, generatePath, responseTransform, bodyGenerator)

    return createAsyncThunk(
        typePrefix,
        asyncRequest        
    )
}