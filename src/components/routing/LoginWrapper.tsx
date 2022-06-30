import { FunctionComponent } from "react"
import { useLocation } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { LoadState } from "../../app/types"
import { selectIsLoggedInLoadState } from "../../features/profile/profileSlice"
import {FullAppRoutingLayout} from "./routingLayouts"

type IsLoggedInProps = {
    isLoggedIn: boolean
    isSignedUp: boolean
    setIsSigedUp: (b: boolean) => void
}

const HUB_AUTH_INIT_URL = `${process.env.REACT_APP_HUB_ORIGIN_URL}/auth/init`

//TODO: Refactor this to a general-purpose HOC
const LoginWrapper: FunctionComponent<IsLoggedInProps> = (props) => {
  
    const isLoggedInLoadState = useAppSelector(selectIsLoggedInLoadState)

    switch (isLoggedInLoadState) {
        case LoadState.NotLoaded:
            return <></>
        case LoadState.Failed:
            return <>ERROR: Failed to get Login status.</>
        case LoadState.Pending:
            return <>Loading...</>        
        case LoadState.Loaded:
            return InnerWrapper(props)
        default:
            throw new Error("Unexpected load state encountered");
    }
}

const InnerWrapper: FunctionComponent<IsLoggedInProps> = ({isLoggedIn, isSignedUp, setIsSigedUp}) =>{

    const {pathname} = useLocation()
    const encodedPathname = encodeURIComponent(pathname)
    if(isLoggedIn){
        return <FullAppRoutingLayout isLoggedIn={isLoggedIn} isSignedUp={isSignedUp} setIsSigedUp={setIsSigedUp}/>
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