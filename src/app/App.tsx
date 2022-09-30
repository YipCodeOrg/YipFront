import MainRouter from "../components/routing/MainRouter"
import { ColorModeScript } from "@chakra-ui/react"
import { HUB_ORIGIN_URL } from "../util/misc";
import { useHubHandshake } from "./hooks";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HubContext } from "./hubContext";

const HUB_API_URL = `${HUB_ORIGIN_URL}/api`

export default function App(){

    const hubContext = useHubHandshake()

    return (    
        <HubContext.Provider value={hubContext}>
            <DndProvider backend={HTML5Backend}>
                <ColorModeScript/>
                <iframe title="YipHub IFrame" id="yipHubFrame"
                    src={HUB_API_URL}
                    style={{position: "absolute", width:0, height:0, border: "none"}}                
                />
                <MainRouter/>
            </DndProvider>
        </HubContext.Provider>
    )
}