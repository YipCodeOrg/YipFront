import { FunctionComponent } from "react"
import { useLocation } from "react-router-dom"
import {FullAppRoutingLayout} from "./routingLayouts"

type IsLoggedInProps = {
    isLoggedIn: boolean | null
    isSignedUp: boolean
    setIsSigedUp: (b: boolean) => void
}

const HUB_AUTH_INIT_URL = `${process.env.REACT_APP_HUB_ORIGIN_URL}/auth/init`

const LoginWrapper: FunctionComponent<IsLoggedInProps> = ({isLoggedIn, isSignedUp, setIsSigedUp}) => {
  
    const {pathname} = useLocation()
    const encodedPathname = encodeURIComponent(pathname)
    if(isLoggedIn === null){
        return <>Loading page...</>
    }
    else if(isLoggedIn){
        return <FullAppRoutingLayout isLoggedIn={isLoggedIn} isSignedUp={isSignedUp}/>
    }
    else{
        if(isSignedUp){
            window.location.replace(`${HUB_AUTH_INIT_URL}?action=login&postLoginRedirect=${encodedPathname}`)
            return <>Navigating to login...</>
        } else{
            setIsSigedUp(true)
            window.location.replace(`${HUB_AUTH_INIT_URL}?action=signup&postLoginRedirect=${encodedPathname}`)
            return <>Navigating to signup...</>
        }
    }
}

export default LoginWrapper