import { FunctionComponent } from "react"
import { Navigate } from "react-router-dom"
import FullLayout from "../core/pageLayouts"

type NotLoggedInProps = {
    isLoggedIn: boolean
    redirect: string
}

const NotLoggedInWrapper: FunctionComponent<NotLoggedInProps> = ({isLoggedIn, redirect}) => {
  
    if(isLoggedIn){
        return <Navigate to={redirect}/>
    }
    else{
        return <FullLayout/>
    }
}

export default NotLoggedInWrapper