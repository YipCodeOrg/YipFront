import {
  ChakraProvider,
  VStack,
  theme,
} from "@chakra-ui/react"
import Hero from "./hero"
import NavBar from "./navBar"
import Footer from "./footer"

export const App = () => (
  <ChakraProvider theme={theme}>
    <NavBar/>
    <VStack>
      <VStack>      
        <Hero/>
      </VStack>
    </VStack>
    <Footer/>
  </ChakraProvider>
)
