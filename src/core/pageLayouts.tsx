import {
    VStack,
    Box,
} from "@chakra-ui/react"
import NavBar from "./NavBar"
import Footer from "./Footer"  

const mainFlexPropVals = {
  flexGrow: "1",
  flexShrink: "0",
  flexBasis: "auto"
}

type LayoutProps = {
  isLoggedIn: boolean,
  isSignedUp: boolean,
}

export const FullSiteLayout: React.FC<LayoutProps> = ({children, isLoggedIn, isSignedUp}) => (    
    <VStack minHeight="100vh" minWidth="100vw">
      <Box minWidth="100vw">
      <NavBar isLoggedIn={isLoggedIn} isSignedUp={isSignedUp}/>
      </Box>
      <main style={mainFlexPropVals}>
        {children}
      </main>
      <Box minWidth="100vw">
        <Footer/>
      </Box>    
    </VStack>
)

export const FullAppLayout: React.FC<LayoutProps> = ({children, isLoggedIn, isSignedUp}) => (    
    <VStack minHeight="100vh" minWidth="100vw">
      <Box minWidth="100vw">
      <NavBar isLoggedIn={isLoggedIn} isSignedUp={isSignedUp}/>
      </Box>
      <main style={mainFlexPropVals}>
        {children}
      </main>
      <Box minWidth="100vw">
        <Footer/>
      </Box>    
    </VStack>
)