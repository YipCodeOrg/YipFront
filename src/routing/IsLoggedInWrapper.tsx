import { useLocation } from "react-router-dom"
import FullLayout from "../core/pageLayouts"

export default function IsLoggedInWrapper(){
  
    const isLoggedIn = false
    const {pathname} = useLocation()
    if(isLoggedIn){
        return <FullLayout/>
    }
    else{
        return <p>Not signed in. Location is: {pathname}</p>
    }
}