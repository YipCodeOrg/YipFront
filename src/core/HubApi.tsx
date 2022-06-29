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

const HUB_ORIGIN_URL = process.env.REACT_APP_HUB_ORIGIN_URL ?? "http://localhost:8000"

 function extractHubMessage(event: MessageEvent<any>) : HubToFrontMessage{
    if (event.origin !== HUB_ORIGIN_URL) {
        throw new Error("Invalid origin: expected message from Hub")
    }
    const data = event.data        
    if(!isHubToFrontMessage(data)){            
        throw new Error("Invalid message format received from Hub")
    }
    
    return data      
};

function getHubWindow() : Window | null{
    const expectedHubFrame = document.querySelector<HTMLIFrameElement>("#yipHubFrame")
    const expectedHubWindow = expectedHubFrame?.contentWindow
    if(!!expectedHubWindow){
        return expectedHubWindow
    }
    else{
        console.log("Problem retrieving Hub frame")
        return null
    }
}

export default async function
    postHubRequest(msg: FrontToHubMessage) : Promise<HubToFrontMessage>
{
    /*Non-MVP: Cache this so we don't have to retrieve it every time. 
    Note: we can't just call this in the top-level of the file because the iframe mightn't be ready yet.*/
    const hubWindow = getHubWindow()
    return new Promise(
        (resolve, reject) => {

            const responseChannel = new MessageChannel();
            
            function handleResponse(event: MessageEvent<any>){
                console.log("Reponse received from Hub")
                const response = extractHubMessage(event)
                resolve(response)
            }
            
            if(!!hubWindow){
                console.log("Posting request to Hub...")
                hubWindow.postMessage(msg, HUB_ORIGIN_URL, [responseChannel.port2])
                console.log("...Finished posting request to Hub")                
                responseChannel.port1.addEventListener("message", handleResponse)
            }
            else{
                reject("Error posting message to Hub - no valid port.")
            }
        }
    )
}