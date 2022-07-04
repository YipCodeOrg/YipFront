type HubToFrontMessage = {
    label: string,
    payload?: ApiResponsePayload
}

type FrontToHubMessage = {
    label: string,
    payload?: ApiRequestPayload
}

type ApiResponsePayload = {
    status: bigint,
    body?: string
}

type ApiRequestPayload = {
    method: string,
    path: string,
    body?: string
}

function isHubToFrontMessage(obj: any): obj is HubToFrontMessage{
    const label = obj.label
    return (typeof label === 'string' || label instanceof String) 
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
                toHubPort.postMessage(msg, [responseChannel.port2])
                console.log("...Finished posting request to Hub")                
            }
            else{
                reject("Error posting message to Hub - no valid port.")
            }
        }
    )
}

export async function sendApiRequest(payload: ApiRequestPayload, toHubPort: MessagePort): Promise<ApiResponsePayload>{
    const msg:FrontToHubMessage = {label: "apiRequest", payload: payload}
    return sendHubRequest(msg, toHubPort).then(val => {
        const payload = val.payload
        if(!!payload){
            return payload
        }
        return Promise.reject("No response payload received from Hub")
    })
}