import { FunctionComponent } from "react"
import { useLocation } from "react-router-dom"
import FullLayout from "../core/pageLayouts"

type IsLoggedInProps = {
    isLoggedIn: boolean
}

const IsLoggedInWrapper: FunctionComponent<IsLoggedInProps> = ({isLoggedIn}) => {
  
    const {pathname} = useLocation()
    if(isLoggedIn){
        return <FullLayout/>
    }
    else{
        return <p>Not signed in. Location is: {pathname}</p>
    }
}

export default IsLoggedInWrapper