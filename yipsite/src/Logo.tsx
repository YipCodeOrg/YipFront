import { FunctionComponent } from 'react';
import {ReactComponent as YipLogo} from "./yiplogo.svg"
import styled from "@emotion/styled"
import { useColorModeValue } from "@chakra-ui/react"

type LogoProps = {
  lightCol:string, darkCol:string
}

export const Logo: FunctionComponent<LogoProps> = ({lightCol, darkCol}) => {
  
  const stroke=useColorModeValue(lightCol, darkCol)

  const customCss = 
  {
    path: {
    stroke: stroke
    }
  } 

  const StyledLogo = styled(YipLogo)`
    ${customCss};
  `
  
  return (    
    <StyledLogo/>  
  );
}
