import { useState } from "react";
import MainRouter from "./routing/MainRouter"
import { ColorModeScript } from "@chakra-ui/react"
import * as React from "react"

export default function App(){

    //TODO: Maybe read this from the store? For persistent login sessions
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [redirect, setRedirect] = useState("/app")

    //TODO: Probably use state
    const isFirstVisit = false

    const REACT_APP_ENV = process.env.REACT_APP_ENV;
    console.log(`Environment: ${REACT_APP_ENV}`)
    
    return (
        <React.StrictMode>
            <ColorModeScript/>
            <iframe title="YipHub IFrame"
                src="http://localhost:8000"
                style={{position: "absolute", width:0, height:0, border: "none"}}                
            />
            <MainRouter isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
                isFirstVisit={isFirstVisit} redirect={redirect} setRedirect={setRedirect}/>
        </React.StrictMode>
    )
}