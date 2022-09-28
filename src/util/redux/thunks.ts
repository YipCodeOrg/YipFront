import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit"
import { ApiRequestPayload } from "../../packages/YipStackLib/util/hubFront"
import { logAndReturnRejectedPromise } from "../../packages/YipStackLib/util/misc"
import { HttpStatusOk, sendApiRequest } from "../hubApi"

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

    const apiRequest: ApiRequestPayload = {
        method,
        path
    }

    const pathStartingWithForwardSlash = path.startsWith("/") ? path : `/${path}`
    const typePrefix = `request${pathStartingWithForwardSlash}/${method}`

    return createAsyncThunk(
        typePrefix,
        async (input: TThunkInput) => {

            if(bodyGenerator !== undefined){
                apiRequest.body = JSON.stringify(bodyGenerator(input))
            }

            const toHubPort = getPort(input)

            const processedResponse = await sendApiRequest(apiRequest, toHubPort)
                .then(res => {
                    if (res.status !== expectedStatus) {
                        return logAndReturnRejectedPromise("Unexpected response status")
                    }
                    const body = res.body
                    if (!!body) {
                        return body
                    } else {
                        return logAndReturnRejectedPromise("No body in response")
                    }
                })
                .then(body => {
                    const obj = JSON.parse(body)
                    if (isResponseCorrectType(obj)) {
                        return obj
                    }
                    return logAndReturnRejectedPromise("Response is not of the correct type")
                })
            return processedResponse
        }
    )
}