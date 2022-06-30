import { useEffect, useState } from "react";
import MainRouter from "../components/routing/MainRouter"
import { ColorModeScript } from "@chakra-ui/react"
import * as React from "react"
import postHubRequest from "../components/core/HubApi";

const HUB_ORIGIN_URL = process.env.REACT_APP_HUB_ORIGIN_URL ?? "http://localhost:8000"
const HUB_API_URL = `${HUB_ORIGIN_URL}/api`

const isSignedUp = !!localStorage.getItem("isSignedUp")

export default function App(){

    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)   
    const [toHubPort, setToHubPort] = useState<MessagePort | null>(null)

    function setIsSigedUp(b: boolean){        
        localStorage.setItem("isSignedUp", String(b))
    }

    const requestLoginStatusFromHub: React.EffectCallback = () => {
        if (!toHubPort) { console.log("Hub not ready yet - no login status requested"); return; }
        console.log("Sending login status request to Hub...");
        postHubRequest({label: "requestLoginStatus"}, toHubPort)        
        .then(val => {
                const status = val.label
                console.log(`...Login status received from Hub: ${status}`);    
                const isLoggedIn = status === "userIsLoggedIn"
                setIsLoggedIn(isLoggedIn)                    
            },
            reason => {throw new Error(`Problem getting login status from Hub: ${reason}`);}
        )        
    };
    
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
    useEffect(requestLoginStatusFromHub, [toHubPort]);

    return (        
        <React.StrictMode>
            <ColorModeScript/>
            <iframe title="YipHub IFrame" id="yipHubFrame"
                src={HUB_API_URL}
                style={{position: "absolute", width:0, height:0, border: "none"}}                
            />
            <MainRouter isLoggedIn={isLoggedIn} setIsSigedUp={setIsSigedUp} isSignedUp={isSignedUp}/>
        </React.StrictMode>
    )
}