import {
  ChakraProvider,
  VStack,
  theme,
} from "@chakra-ui/react"
import Hero from "./hero"
import NavBar from "./navBar"
import Footer from "./footer"
import { Logo } from "./Logo"

export const App = () => (
  <ChakraProvider theme={theme}>
    <NavBar/>
    <VStack>
      <VStack>      
        <Hero/>
      </VStack>
    </VStack>
    <Logo lightCol='#000000' darkCol='#ffffff'/>
    <Footer/>
  </ChakraProvider>
)
