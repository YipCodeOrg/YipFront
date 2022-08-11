import {
    VStack,
    Box,
} from "@chakra-ui/react"
import NavBarWrapper from "./NavBar"
import Footer from "./Footer"  
import { growFlexProps, shrinkToParent } from "../../util/cssHelpers"

type LayoutProps = {
  isLoggedIn: boolean
  isSignedUp: boolean
  setIsSigedUp: (b: boolean) => void
  children?: React.ReactNode
}

const mainFlexProps ={
  display: "flex",
  ...growFlexProps
}

export const FullAppLayout: React.FC<LayoutProps> = ({children, isLoggedIn, isSignedUp, setIsSigedUp}) => (    
    
      <VStack minHeight="100vh" minWidth="100vw">
        <Box minWidth="100vw">
          <NavBarWrapper isLoggedIn={isLoggedIn} isSignedUp={isSignedUp} setIsSigedUp={setIsSigedUp}/>
        </Box>
        <main style={mainFlexProps}>
          <VStack minWidth="100vw" style={shrinkToParent}>        
              {children}
          </VStack>
        </main>
        <Box minWidth="100vw">
          <Footer/>
        </Box>    
      </VStack>    
)

// For now, layouts are the same. In future, if they diverge, we can write a separate site layout.
export const FullSiteLayout = FullAppLayout