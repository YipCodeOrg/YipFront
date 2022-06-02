import { FunctionComponent } from "react"
import { useLocation } from "react-router-dom"
import FullLayout from "../core/pageLayouts"

type IsLoggedInProps = {
    isLoggedIn: boolean
    isFirstVisit: boolean
}

const IsLoggedInWrapper: FunctionComponent<IsLoggedInProps> = ({isLoggedIn, isFirstVisit}) => {
  
    const {pathname} = useLocation()
    if(isLoggedIn){
        return <FullLayout/>
    }
    else{
        if(isFirstVisit){
            return <p>First Visit! Need to remember: {pathname}</p>
        } else{
            return <p>Subsequent visit. Need to remember: {pathname}</p>
        }
    }
}

export default IsLoggedInWrapper