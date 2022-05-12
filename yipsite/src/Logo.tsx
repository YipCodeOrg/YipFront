import {ReactComponent as YipLogo} from "./yiplogo.svg"
import styled from "@emotion/styled"
import { css } from "@emotion/react"
import { useColorModeValue } from "@chakra-ui/react"

export const Logo = () => {
  
  const stroke=useColorModeValue('#000000', '#ffffff')

  const customCss = css`  
  path {
    stroke: ${stroke};
    }
  `

  const StyledLogo = styled(YipLogo)`
    ${customCss};
  `
  
  return (
    <StyledLogo/>
  );
}
