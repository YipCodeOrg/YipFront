import { FunctionComponent } from "react"
import { Navigate, useLocation } from "react-router-dom"
import FullRoutingLayout from "./routingLayouts"

type IsLoggedInProps = {
    isLoggedIn: boolean
    isFirstVisit: boolean
    setRedirect: (s: string) => void
}

const IsLoggedInWrapper: FunctionComponent<IsLoggedInProps> = ({isLoggedIn, isFirstVisit, setRedirect}) => {
  
    const {pathname} = useLocation()
    if(isLoggedIn){
        return <FullRoutingLayout/>
    }
    else{
        setRedirect(pathname)
        if(isFirstVisit){
            return <Navigate to="/auth/signup"/>
        } else{
            return <Navigate to="/auth/login"/>
        }
    }
}

export default IsLoggedInWrapper