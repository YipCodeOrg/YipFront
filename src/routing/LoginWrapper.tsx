import { FunctionComponent } from "react"
import { useLocation } from "react-router-dom"
import FullRoutingLayout from "./routingLayouts"

type IsLoggedInProps = {
    isLoggedIn: boolean
    isFirstVisit: boolean
    setRedirect: (s: string) => void
}

const HUB_AUTH_URL = `${process.env.REACT_APP_HUB_ORIGIN_URL}/auth`

const LoginWrapper: FunctionComponent<IsLoggedInProps> = ({isLoggedIn, isFirstVisit, setRedirect}) => {
  
    const {pathname} = useLocation()
    if(isLoggedIn){
        return <FullRoutingLayout/>
    }
    else{
        setRedirect(pathname)
        if(isFirstVisit){
            window.location.replace(`${HUB_AUTH_URL}?action=login`)
        } else{
            window.location.replace(`${HUB_AUTH_URL}?action=signup`)
        }
        return <>Navigating to login...</>
    }
}

export default LoginWrapper