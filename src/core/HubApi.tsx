type HubToFrontMessage = {
    label: string,
    payload?: string
}

function isHubToFrontMessage(obj: any): obj is HubToFrontMessage{
    const label = obj.label
    return (typeof label === 'string' || label instanceof String) 
}

const HUB_ORIGIN_URL = process.env.REACT_APP_HUB_ORIGIN_URL ?? "http://localhost:8000"

export default class HubApi{
    
    private readonly _handlerMap: Map<string, (msg: HubToFrontMessage) => void>
    
    constructor(handlerMap: Map<string, (msg: HubToFrontMessage) => void>){
        this._handlerMap = handlerMap
    }

    public handleHubMessage(event: MessageEvent<any>){
        if (event.origin !== HUB_ORIGIN_URL) {
            //Note: we don't throw an exception here because there are other listeners that process messages from other origins
            //For example, there seems to be web socket messages from self.origin when running this with NPM locally
            return;
        }
        const data = event.data        
        if(!isHubToFrontMessage(data)){            
            throw new Error("Invalid message format received from Hub")
        }
        
        const label = data.label        

        const handler = this._handlerMap.get(label)
        if(!!handler){
            handler(data)
            console.log(`Processed message from Hub: ${label}`)
        }        
    };
}