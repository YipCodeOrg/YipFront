import { Box, Spinner, VStack } from "@chakra-ui/react"
import { FunctionComponent } from "react"
import { Logo } from "./Logo"

type LoadingLogoProps = {
    lightCol:string,
    darkCol:string,
    logoSize: number,
    spinnerSize: string
  }

const LoadingLogo: FunctionComponent<LoadingLogoProps> = ({lightCol, darkCol, logoSize, spinnerSize}) =>{
    return (
        <Box style={{
            position: 'fixed',
            left: '50%',
            top: '40%'
        }}>
            <VStack>
                <Logo size={logoSize}
                    lightCol={lightCol}
                    darkCol={darkCol}/>            
                <Spinner size={spinnerSize} speed="1.4s"/>
            </VStack>
        </Box>
    )
}

export default LoadingLogo