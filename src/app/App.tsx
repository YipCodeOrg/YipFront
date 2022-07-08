import { createContext } from "react";
import MainRouter from "../components/routing/MainRouter"
import { ColorModeScript } from "@chakra-ui/react"
import { HUB_ORIGIN_URL } from "../util/misc";
import { useHubHandshake } from "./hooks";

const HUB_API_URL = `${HUB_ORIGIN_URL}/api`

const isSignedUp = !!localStorage.getItem("isSignedUp")

export const HubPortContext = createContext<MessagePort | null>(null)

export default function App(){

    //Non-MVP: Move this down to the main router - no need to prop thread it from here
    function setIsSigedUp(b: boolean){        
        localStorage.setItem("isSignedUp", String(b))
    }

    const toHubPort = useHubHandshake()

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