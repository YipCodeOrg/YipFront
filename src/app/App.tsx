import { createContext } from "react";
import MainRouter from "../components/routing/MainRouter"
import { ColorModeScript } from "@chakra-ui/react"
import { HUB_ORIGIN_URL } from "../util/misc";
import { useHubHandshake } from "./hooks";

const HUB_API_URL = `${HUB_ORIGIN_URL}/api`

export const HubContext = createContext<[MessagePort | null, boolean]>([null, false])

export default function App(){

    const hubContext = useHubHandshake()

    return (    
        <HubContext.Provider value={hubContext}>
            <ColorModeScript/>
            <iframe title="YipHub IFrame" id="yipHubFrame"
                src={HUB_API_URL}
                style={{position: "absolute", width:0, height:0, border: "none"}}                
            />
            <MainRouter/>
        </HubContext.Provider>
    )
}