import { ASyncFunction } from "../../packages/YipStackLib/packages/YipAddress/util/misc"
import { ApiRequestPayload } from "../../packages/YipStackLib/util/hubFront"
import { logAndReturnRejectedPromise } from "../../packages/YipStackLib/util/misc"
import { sendApiRequest } from "../hubApi"

type InputWithPort = {
    port: MessagePort
}

export type PortBodyInput<TBody> = {
    body: TBody
} & InputWithPort

export type PortBodyRequest<TBody, TResponse> = ASyncFunction<PortBodyInput<TBody>, TResponse>

export function createApiRequest<TRequestInput, TResponse, TReturn, TBody={}>(
    getPort: (i: TRequestInput) => MessagePort,
    isResponseCorrectType: (obj: any) => obj is TResponse,    
    expectedStatus: number, method: string, path: string,    
    responseTransform: (_: TResponse) => TReturn,
    bodyGenerator?: (i: TRequestInput) => TBody)
    : (i: TRequestInput) => Promise<TReturn> {

    const apiRequest: ApiRequestPayload = {
        method,
        path
    }

    return async (input: TRequestInput) => {
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
            .then(responseTransform)
        return processedResponse
    }
}