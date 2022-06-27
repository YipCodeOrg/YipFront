import { useEffect, useState } from "react";
import MainRouter from "./routing/MainRouter"
import { ColorModeScript } from "@chakra-ui/react"
import * as React from "react"

const HUB_ORIGIN_URL = process.env.REACT_APP_HUB_ORIGIN_URL ?? "http://localhost:8000"
const HUB_API_URL = `${HUB_ORIGIN_URL}/api`

function postHubMessage(msg: FrontToHubMessage){
    const expectedHubFrame = document.querySelector<HTMLIFrameElement>("#yipHubFrame")
    const expectedHubWindow = expectedHubFrame?.contentWindow
    if(!!expectedHubWindow){
        expectedHubWindow.postMessage(msg, HUB_ORIGIN_URL)
    }
    else{
        throw new Error("Problem retrieving Hub frame")
    }
}

const isSignedUp = !!localStorage.getItem("isSignedUp")

type FrontToHubMessage = {
    label: string,
    payload?: string
}

type HubToFrontMessage = {
    label: string,
    payload?: string
}

export default function App(){

    //TODO: Maybe read this from the store? For persistent login sessions
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)   
    const [isHubReady, setIsHubReady] = useState(false)

    function setIsSigedUp(b: boolean){        
        localStorage.setItem("isSignedUp", String(b))
    }

    const requestLoginStatusFromHub: React.EffectCallback = () => {
        if (!isHubReady) { console.log("Hub not ready yet - no login status requested"); return; }
        console.log("Requesting login status from Hub...");
        postHubMessage({label: "requestLoginStatus"});
        console.log("...Login status request requested");
    };
    
    const addMessageListener: React.EffectCallback = () => {
        const handleHubMessage = (event: MessageEvent<HubToFrontMessage>) => {
            if (event.origin !== HUB_ORIGIN_URL) {
                //Note: we don't throw an exception here because there are other listeners that process messages from other origins
                //For example, there seems to be web socket messages from self.origin when running this with NPM locally
                return;
            }
            const data = event.data
            const label = data.label
            let postHandleMsg: string = "Processed message from Hub: "
            switch (label) {
                case "readyToListen":
                    postHandleMsg += "Hub is ready to listen"
                    setIsHubReady(true)
                    break;
                case "userIsLoggedIn":
                    postHandleMsg += "User is logged in"
                    setIsLoggedIn(true)
                    break;
                case "userNotLoggedIn":
                    postHandleMsg += "User not logged in"
                    setIsLoggedIn(false)
                    break;
                default:
                    const errorMsg = "Unhandled message data received from Hub"
                    postHandleMsg += `ERROR ${errorMsg}`
                    throw new Error(errorMsg)
            }
            console.log(postHandleMsg)
        };

        window.addEventListener("message", handleHubMessage);
        return () => {
            window.removeEventListener("message", handleHubMessage);
        };
    };

    useEffect(addMessageListener, []);
    useEffect(requestLoginStatusFromHub, [isHubReady]);

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