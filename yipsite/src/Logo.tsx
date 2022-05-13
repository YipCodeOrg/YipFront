import { FunctionComponent } from 'react';
import {ReactComponent as YipLogo} from "./yiplogo.svg"
import styled from "@emotion/styled"
import { useColorModeValue } from "@chakra-ui/react"

type LogoProps = {
  lightCol:string,
  darkCol:string,
  size: number
}

export const Logo: FunctionComponent<LogoProps> = ({lightCol, darkCol, size}) => {
  
  const stroke=useColorModeValue(lightCol, darkCol)

  const customCss = 
  {
    path: {
    stroke: stroke
    },
    height: size,
  } 

  const StyledLogo = styled(YipLogo)`
    ${customCss};
  `
  
  return (    
    <StyledLogo width={size} height={size}/>  
  );
}
