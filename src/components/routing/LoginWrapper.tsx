import { Center } from "@chakra-ui/react"
import { FunctionComponent, useContext } from "react"
import { useLocation } from "react-router-dom"
import { HubContext } from "../../app/App"
import { useLoginHubFetch } from "../../features/profile/profileSlice"
import { EmptyLoadStateWrapper } from "../hoc/LoadStateWrapper"
import {FullAppRoutingLayout} from "./routingLayouts"

type IsLoggedInProps = {
    isSignedUp: boolean
    setIsSigedUp: (b: boolean) => void
}

const HUB_AUTH_INIT_URL = `${process.env.REACT_APP_HUB_ORIGIN_URL}/auth/init`

//TODO: Refactor this to a general-purpose HOC
const LoginWrapper: FunctionComponent<IsLoggedInProps> = (props) => {
    const { isHubLoadError } = useContext(HubContext)
    const {sliceData: isLoggedIn, loadStatus: isLoggedInLoadStatus} = useLoginHubFetch()

    if(isHubLoadError){
        return <Center>ERROR LOADING PAGE</Center>
    } else{
        return <EmptyLoadStateWrapper status={isLoggedInLoadStatus}
                loadedElement = {<InnerWrapper {...{isLoggedIn, ...props}}/>}/>
    }        
}

type InnerWrapperProps = {
    isLoggedIn: boolean | undefined
} & IsLoggedInProps

const InnerWrapper: FunctionComponent<InnerWrapperProps> = ({isSignedUp, setIsSigedUp, isLoggedIn}) =>{
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