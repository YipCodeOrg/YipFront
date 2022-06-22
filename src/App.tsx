import { useEffect, useState } from "react";
import MainRouter from "./routing/MainRouter"
import { ColorModeScript } from "@chakra-ui/react"
import * as React from "react"

export default function App(){

    //TODO: Maybe read this from the store? For persistent login sessions
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [redirect, setRedirect] = useState("/app")

    //TODO: Probably use state
    const isFirstVisit = false

    const HUB_ORIGIN_URL = process.env.REACT_APP_HUB_ORIGIN_URL
    const HUB_API_URL = `${HUB_ORIGIN_URL}/api`
    
    useEffect(() => {
        const handleHubMessage = (event: MessageEvent) => {
            if(event.origin != HUB_ORIGIN_URL){
                //Note: we don't throw an exception here because there are other listeners that process messages from other origins
                //For example, there seems to be web socket messages from self.origin when running this with NPM locally
                return
            }
            const data = event.data
            switch(data){
                case "userIsLoggedIn":
                    console.log("Received message from Hub: user is logged in")
                    setIsLoggedIn(true)
                    return
                case "userNotLoggedIn":
                    console.log("Received message from Hub: user is not logged in")
                    setIsLoggedIn(false)
                    return
            }
            throw "Unhandled message data received from Hub."            
        };
    
        window.addEventListener("message", handleHubMessage);
        return () => {
            window.removeEventListener("message", handleHubMessage);
        };
      }, []);

    return (        
        <React.StrictMode>
            <ColorModeScript/>
            <iframe title="YipHub IFrame"
                src={HUB_API_URL}
                style={{position: "absolute", width:0, height:0, border: "none"}}                
            />
            <MainRouter isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
                isFirstVisit={isFirstVisit} redirect={redirect} setRedirect={setRedirect}/>
        </React.StrictMode>
    )
}