import { useState } from "react";
import MainRouter from "./routing/MainRouter"

export default function App(){

    //TODO: Maybe read this from the store? For persistent login sessions
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [redirect, setRedirect] = useState("/app")

    //TODO: Probably use state
    const isFirstVisit = false
    
    return <MainRouter isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
        isFirstVisit={isFirstVisit} redirect={redirect} setRedirect={setRedirect}/>
}