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

export function liftBodyToPortBodyFunction2<TBody, T2, TReturn>(f: (b: TBody, v2: T2) => TReturn){
    return function(i: PortBodyInput<TBody>, v2: T2){
        return f(i.body, v2)
    }
}

export type PortBodyRequest<TBody, TResponse> = ASyncFunction<PortBodyInput<TBody>, TResponse>

export function createApiRequest<TRequestInput, TResponse, TReturn, TBody={}>(
    getPort: (i: TRequestInput) => MessagePort,
    isResponseCorrectType: (obj: any) => obj is TResponse,    
    expectedStatus: number, method: string, generatePath: (i: TRequestInput) => string,
    responseTransform: (_: TResponse) => TReturn,
    bodyGenerator?: (i: TRequestInput) => TBody)
    : (i: TRequestInput) => Promise<TReturn> {

    return async (input: TRequestInput) => {

        const apiRequest: ApiRequestPayload = {
            method,
            path: generatePath(input)
        }

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