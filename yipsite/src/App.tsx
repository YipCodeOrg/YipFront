import {
  ChakraProvider,
  VStack,
  theme,
  Box,
} from "@chakra-ui/react"
import Hero from "./hero"
import NavBar from "./navBar"
import Footer from "./footer"
import { BrowserRouter } from "react-router-dom";

const mainFlexProps = {
  flexGrow: "1",
  flexShrink: "0",
  flexBasis: "auto"
}

export const App = () => (
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <VStack minHeight="100vh" minWidth="100vw">
        <Box minWidth="100vw">
        <NavBar/>
        </Box>
        <main style={mainFlexProps}>
          <VStack>  
            <Hero/>
          </VStack>
        </main>
        <Box minWidth="100vw">
          <Footer/>
        </Box>    
      </VStack>
    </ChakraProvider>
  </BrowserRouter>
)
