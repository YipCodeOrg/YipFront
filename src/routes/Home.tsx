import {
  VStack,
} from "@chakra-ui/react"
import Hero from "../core/Hero"
import FullLayout from "../core/pageLayouts"

export default function Home() {
    return (
      <FullLayout>
          <VStack> 
          {/*TODO*/} 
            <Hero/>
          </VStack>
      </FullLayout>
      );
}
