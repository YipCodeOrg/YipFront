import { FunctionComponent } from "react"
import { Navigate } from "react-router-dom"
import FullRoutingLayout from "./routingLayouts"

type NotLoggedInProps = {
    isLoggedIn: boolean
    redirect: string
}

const NotLoggedInWrapper: FunctionComponent<NotLoggedInProps> = ({isLoggedIn, redirect}) => {
  
    if(isLoggedIn){
        return <Navigate to={redirect}/>
    }
    else{
        return <FullRoutingLayout/>
    }
}

export default NotLoggedInWrapper