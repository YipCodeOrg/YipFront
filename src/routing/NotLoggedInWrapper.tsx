import { FunctionComponent } from "react"
import FullLayout from "../core/pageLayouts"

type NotLoggedInProps = {
    isLoggedIn: boolean
    redirect: string
}

const NotLoggedInWrapper: FunctionComponent<NotLoggedInProps> = ({isLoggedIn, redirect: pathname}) => {
  
    if(isLoggedIn){
        return <p>Already signed in. We should route back to: {pathname}</p>
    }
    else{
        return <FullLayout/>
    }
}

export default NotLoggedInWrapper