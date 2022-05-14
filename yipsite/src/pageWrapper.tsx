import {
    ChakraProvider,
    VStack,
    theme,
    Box,
} from "@chakra-ui/react"
import NavBar from "./navBar"
import Footer from "./footer"  

const mainFlexPropVals = {
  flexGrow: "1",
  flexShrink: "0",
  flexBasis: "auto"
}

type PageWrapperProps = {
};

const PageWrapper: React.FC<PageWrapperProps> =({children}) => (
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

export default PageWrapper;