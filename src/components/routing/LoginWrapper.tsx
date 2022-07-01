import { FunctionComponent } from "react"
import { useLocation } from "react-router-dom"
import { useLoginHubLoad } from "../../features/profile/profileSlice"
import LoadStateWrapper from "../hoc/LoadStateWrapper"
import {FullAppRoutingLayout} from "./routingLayouts"

type IsLoggedInProps = {
    isSignedUp: boolean
    setIsSigedUp: (b: boolean) => void
}

const HUB_AUTH_INIT_URL = `${process.env.REACT_APP_HUB_ORIGIN_URL}/auth/init`

//TODO: Refactor this to a general-purpose HOC
const LoginWrapper: FunctionComponent<IsLoggedInProps> = ({isSignedUp, setIsSigedUp}) => {
  
    const [isLoggedIn, isLoggedInLoadStatus] = useLoginHubLoad()
    const {pathname} = useLocation()

    const InnerWrapper = () =>{

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

    return <LoadStateWrapper status={isLoggedInLoadStatus} element = {<InnerWrapper/>}/>
    
}



export default LoginWrapper