import {
    ChakraProvider,
    VStack,
    theme,
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
};

export const BareLayout: React.FC<LayoutProps> = ({children}) => (
  <ChakraProvider theme={theme}>      
    {children}
  </ChakraProvider>
)

const FullLayout: React.FC<LayoutProps> = ({children}) => (
    <ChakraProvider theme={theme}>
      <VStack minHeight="100vh" minWidth="100vw">
        <Box minWidth="100vw">
        <NavBar/>
        </Box>
        <main style={mainFlexPropVals}>
          {children}
        </main>
        <Box minWidth="100vw">
          <Footer/>
        </Box>    
      </VStack>
    </ChakraProvider>
);

export default FullLayout;