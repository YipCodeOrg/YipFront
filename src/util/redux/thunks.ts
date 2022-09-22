import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit"
import { ApiRequestPayload } from "../../packages/YipStackLib/util/hubFront"
import { logAndReturnRejectedPromise } from "../../packages/YipStackLib/util/misc"
import { HttpStatusOk, sendApiRequest } from "../hubApi"

type ThunkInputWithPort = {
    port: MessagePort
}

type PostThunkInput<TBody> = {
    body: TBody
} & ThunkInputWithPort

export function createApiPostThunk<TBody, TResponse>(path: string,
    isCorrectType: (obj: any) => obj is TResponse) {
    return createApiRequestThunk<PostThunkInput<TBody>, TResponse, TBody>
        (p => p.port, isCorrectType, HttpStatusOk, "POST", path, i => i.body)
}

export function createApiGetThunk<T>(path: string, isCorrectType: (obj: any) => obj is T) {    
    return createApiRequestThunk<MessagePort, T>(p => p, isCorrectType, HttpStatusOk, "GET", path)
}

function createApiRequestThunk<TThunkInput, TResponse, TBody={}>(
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