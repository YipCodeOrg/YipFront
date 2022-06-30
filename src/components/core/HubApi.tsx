type HubToFrontMessage = {
    label: string,
    payload?: string
}

type FrontToHubMessage = {
    label: string,
    payload?: string
}

function isHubToFrontMessage(obj: any): obj is HubToFrontMessage{
    const label = obj.label
    return (typeof label === 'string' || label instanceof String) 
}

export default async function
    postHubRequest(msg: FrontToHubMessage, toHubPort: MessagePort) : Promise<HubToFrontMessage>
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