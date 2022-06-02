import { FunctionComponent } from "react"
import { useLocation } from "react-router-dom"
import FullLayout from "../core/pageLayouts"

type IsLoggedInProps = {
    isLoggedIn: boolean
    isFirstVisit: boolean
    setRedirect: (s: string) => void
}

const IsLoggedInWrapper: FunctionComponent<IsLoggedInProps> = ({isLoggedIn, isFirstVisit, setRedirect}) => {
  
    const {pathname} = useLocation()
    if(isLoggedIn){
        return <FullLayout/>
    }
    else{
        setRedirect(pathname)
        if(isFirstVisit){
            return <p>First Visit! Need to remember: {pathname}</p>
        } else{
            return <p>Subsequent visit. Need to remember: {pathname}</p>
        }
    }
}

export default IsLoggedInWrapper