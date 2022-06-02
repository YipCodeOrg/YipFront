import { Button } from "@chakra-ui/react"
import { FunctionComponent } from "react"

type LoginProps = {
    setIsLoggedIn: (b: boolean) => void
}

const Login: FunctionComponent<LoginProps> = ({setIsLoggedIn}) => {
    return <Button onClick={() => setIsLoggedIn(true)}>Login</Button>
}

export default Login