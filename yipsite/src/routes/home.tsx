import {
  ChakraProvider,
  VStack,
  theme,
  Box,
} from "@chakra-ui/react"
import Hero from "../hero"
import NavBar from "../navBar"
import Footer from "../footer"
import { Link } from "react-router-dom";

const mainFlexProps = {
  flexGrow: "1",
  flexShrink: "0",
  flexBasis: "auto"
}

export default function Home() {
    return (<ChakraProvider theme={theme}>
      <VStack minHeight="100vh" minWidth="100vw">
        <Box minWidth="100vw">
        <NavBar/>
        </Box>
        <main style={mainFlexProps}>
          <VStack>  
            <Hero/>
          </VStack>
          <Link to="/blog">Blog</Link> |{" "}
          <Link to="/about">About</Link>
        </main>
        <Box minWidth="100vw">
          <Footer/>
        </Box>    
      </VStack>
    </ChakraProvider>);
}
