import * as React from "react"
import {
  ChakraProvider,
  VStack,
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import Hero from "./hero"

export const App = () => (
  <ChakraProvider theme={theme}> 
    <VStack>      
      <ColorModeSwitcher justifySelf="flex-end" />
      <Hero/>
    </VStack>
  </ChakraProvider>
)
