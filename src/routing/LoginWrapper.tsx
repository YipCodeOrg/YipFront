import { FunctionComponent } from "react"
import { useLocation } from "react-router-dom"
import {FullAppRoutingLayout} from "./routingLayouts"

type IsLoggedInProps = {
    isLoggedIn: boolean | null
    isSignedUp: boolean
    setRedirect: (s: string) => void
    setIsSigedUp: (b: boolean) => void
}

const HUB_AUTH_INIT_URL = `${process.env.REACT_APP_HUB_ORIGIN_URL}/auth/init`

const LoginWrapper: FunctionComponent<IsLoggedInProps> = ({isLoggedIn, isSignedUp, setRedirect, setIsSigedUp}) => {
  
    const {pathname} = useLocation()
    if(isLoggedIn === null){
        return <>Loading page...</>
    }
    else if(isLoggedIn){
        return <FullAppRoutingLayout isLoggedIn={isLoggedIn} isSignedUp={isSignedUp}/>
    }
    else{
        setRedirect(pathname)
        if(isSignedUp){
            window.location.replace(`${HUB_AUTH_INIT_URL}?action=login`)
        } else{
            setIsSigedUp(true)
            window.location.replace(`${HUB_AUTH_INIT_URL}?action=signup`)
        }
        return <>Navigating to login...</>
    }
}

export default LoginWrapper