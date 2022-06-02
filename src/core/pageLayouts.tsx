import {
    ChakraProvider,
    VStack,
    theme,
    Box,
} from "@chakra-ui/react"
import NavBar from "./NavBar"
import Footer from "./Footer"  
import { Outlet } from "react-router-dom";

const mainFlexPropVals = {
  flexGrow: "1",
  flexShrink: "0",
  flexBasis: "auto"
}

const FullLayout = () => (
    <ChakraProvider theme={theme}>
      <VStack minHeight="100vh" minWidth="100vw">
        <Box minWidth="100vw">
        <NavBar/>
        </Box>
        <main style={mainFlexPropVals}>
          <Outlet/>
        </main>
        <Box minWidth="100vw">
          <Footer/>
        </Box>    
      </VStack>
    </ChakraProvider>
);

export default FullLayout;