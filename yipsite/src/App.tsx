import * as React from "react"
import {
  ChakraProvider,
  VStack,
  theme,
} from "@chakra-ui/react"
import Hero from "./hero"
import NavBar from "./navBar"

export const App = () => (
  <ChakraProvider theme={theme}>
    <NavBar/>
    <VStack>      
      <Hero/>
    </VStack>
  </ChakraProvider>
)
