import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
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
            <Code fontSize="xl">YipCode</Code> <b>Y</b>our <b>I</b>nternet <b>P</b>ostcode.
          </Text>
          <Link
            color="teal.500"
            href="https://github.com/ColmBhandal/YipSite"
            fontSize="2xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            The future of postal address management is coming. Stay tuned.
          </Link>
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
)
