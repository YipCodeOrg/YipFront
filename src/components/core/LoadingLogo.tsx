import { Spinner, StackProps, VStack } from "@chakra-ui/react"
import { FunctionComponent } from "react"
import { Logo } from "./Logo"

interface LoadingLogoProps extends StackProps {
    lightCol:string,
    darkCol:string,
    logoSize: number
  }

const LoadingLogo: FunctionComponent<LoadingLogoProps> = ({lightCol, darkCol, logoSize, ...rest}) =>{
    
    const spinnerSize = logoSize/8
    
    return (        
        <VStack {...rest}>
            <Logo size={logoSize}
                    lightCol={lightCol}
                    darkCol={darkCol}/>    
            <Spinner w={spinnerSize} h={spinnerSize} speed="1.4s">        
            </Spinner>
        </VStack>        
    )
}

export default LoadingLogo