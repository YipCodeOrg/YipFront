import { createContext, useEffect, useState } from "react";
import MainRouter from "../components/routing/MainRouter"
import { ColorModeScript } from "@chakra-ui/react"

const HUB_ORIGIN_URL = process.env.REACT_APP_HUB_ORIGIN_URL ?? "http://localhost:8000"
const HUB_API_URL = `${HUB_ORIGIN_URL}/api`

const isSignedUp = !!localStorage.getItem("isSignedUp")

export const HubPortContext = createContext<MessagePort | null>(null)

export default function App(){

    const [toHubPort, setToHubPort] = useState<MessagePort | null>(null)

    function setIsSigedUp(b: boolean){        
        localStorage.setItem("isSignedUp", String(b))
    }

    const listenOnceForHubReady: React.EffectCallback = () => {
        
        const allowedMessage = "readyToListen"

        function handleReadyMessage(event: MessageEvent<any>){
            if (event.origin !== HUB_ORIGIN_URL) {
                //Note: we don't throw an exception here because there are other listeners that process messages from other origins
                //For example, there seems to be web socket messages from self.origin when running this with NPM locally
                return;
            }
            const data = event.data
            if(!(typeof data === 'string' || data instanceof String) || data !== allowedMessage){            
                throw new Error("Invalid message format received from Hub prior to readyToListen message.")
            }
            const port = event.ports[0]      
            setToHubPort(port)
            //Removes itself once it's done its job
            window.removeEventListener("message", handleReadyMessage);            
        }

        window.addEventListener("message", handleReadyMessage);
    };

    useEffect(listenOnceForHubReady, []);

    return (    
        <HubPortContext.Provider value={toHubPort}>
            <ColorModeScript/>
            <iframe title="YipHub IFrame" id="yipHubFrame"
                src={HUB_API_URL}
                style={{position: "absolute", width:0, height:0, border: "none"}}                
            />
            <MainRouter setIsSigedUp={setIsSigedUp} isSignedUp={isSignedUp}/>
        </HubPortContext.Provider>
    )
}