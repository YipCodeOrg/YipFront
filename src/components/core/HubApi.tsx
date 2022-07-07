import { logAndReject, logAndReturnRejectedPromise } from "../../util/misc"

export const HttpStatusOk: number = 200

type HubToFrontMessage = {
    label: string,
    payload?: ApiResponsePayload
}

type FrontToHubMessage = {
    label: string,
    payload?: ApiRequestPayload
}

type ApiResponsePayload = {
    status: number,
    body?: string
}

type ApiRequestPayload = {
    method: string,
    path: string,
    body?: string
}

function isHubToFrontMessage(obj: any): obj is HubToFrontMessage{
    const label = obj.label
    if (!(typeof label == 'string' || label instanceof String)) {
        return false
    }
    const payload = obj.payload
    if(!!payload && !isValidResponsePayload(payload)){
        return false
    }
    return true
}

function isValidResponsePayload(obj: any): obj is ApiResponsePayload{
    const status = obj.status
    if (!(typeof status == 'number' || status instanceof Number)) {
        return false
    }
    const body = obj.body
    if(!!body && !(typeof body == 'string' || body instanceof String)){
        return false
    }
    return true
}

export async function
    sendHubRequest(msg: FrontToHubMessage, toHubPort: MessagePort) : Promise<HubToFrontMessage>
{
    function extractHubChannelMessage(event: MessageEvent<any>) : HubToFrontMessage{
        const data = event.data        
        if(!isHubToFrontMessage(data)){            
            throw new Error("Invalid message format received from Hub")
        }
        
        return data
    }
    return new Promise(
        (resolve, reject) => {
            function handleChannelResponse(event: MessageEvent<any>){
                console.log("Reponse received from Hub")
                const response = extractHubChannelMessage(event)
                resolve(response)
            }
            
            if(!!toHubPort){
                const responseChannel = new MessageChannel();
                responseChannel.port1.onmessage = handleChannelResponse
                console.log("Posting request to Hub...")
                try{
                    toHubPort.postMessage(msg, [responseChannel.port2])
                }
                catch(e: any){
                    let errorMsg = "Error posting message"
                    if(e instanceof Error){
                        errorMsg += `: ${e.message}`
                    }
                    console.log(errorMsg)
                    logAndReject(reject, errorMsg)
                }
                console.log("...Finished posting request to Hub")                
            }
            else{
                logAndReject(reject, "Error posting message to Hub - no valid port.")
            }
        }
    )
}

const apiResponseLabel = "apiResponse"
const apiResponseErrorLabel = "apiResponseError"
export async function sendApiRequest(payload: ApiRequestPayload, toHubPort: MessagePort): Promise<ApiResponsePayload>{
    const msg:FrontToHubMessage = {label: "apiRequest", payload: payload}
    return sendHubRequest(msg, toHubPort).then(val => {
        const label = val.label
        if(label === apiResponseErrorLabel){
            return logAndReturnRejectedPromise("An error occurred during the API request")
        }
        if(label !== apiResponseLabel){
            return logAndReturnRejectedPromise("Invalid response label")
        }        
        const payload = val.payload
        //Non-MVP: Convert status to number here if it's not already one?
        if(!!payload){
            return payload
        }
        return logAndReturnRejectedPromise("No response payload received from Hub")
    })
}