import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Logo h="40vmin" pointerEvents="none" />
          <Text fontSize="xxl">
            <b>Yip</b><Code fontSize="xl">Code</Code> <b>Y</b>our <b>I</b>nternet <b>P</b>ostcode.
          </Text>
          <Text fontSize="2xl">
            The future of postal address management is coming. Stay tuned.
          </Text>
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
)
