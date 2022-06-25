import {
  VStack,
} from "@chakra-ui/react"
import Hero from "../core/Hero"
import { FullSiteLayout } from "../core/pageLayouts"

export default function Home() {
    return (
      <FullSiteLayout>
          <VStack> 
          {/*TODO*/} 
            <Hero/>
          </VStack>
      </FullSiteLayout>
      );
}
