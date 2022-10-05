import { ApiRequestPayload, ApiResponsePayload, FrontToHubMessage, HubToFrontMessage } from "../packages/YipStackLib/util/hubFront"
import { logAndReject, logAndReturnRejectedPromise } from "../packages/YipStackLib/util/misc"

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
    function extractHubChannelMessageIfValid(event: MessageEvent<any>) : HubToFrontMessage | null{
        const data = event.data        
        if(!isHubToFrontMessage(data)){            
            return null
        }
        
        return data
    }
    return new Promise(
        (resolve, reject) => {
            function handleChannelResponse(event: MessageEvent<any>){
                console.log("Reponse received from Hub")
                const response = extractHubChannelMessageIfValid(event)
                if(!!response){
                    resolve(response)
                } else{
                    logAndReject(reject, "Invalid message format received from Hub")                
                }                
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