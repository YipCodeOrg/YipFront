import {
  VStack,
} from "@chakra-ui/react"
import Hero from "../core/Hero"
import { FullSiteLayout } from "../core/pageLayouts"

type HomeProps = {
  isLoggedIn: boolean,
  isSignedUp: boolean,
}

const Home: React.FC<HomeProps> = ({isLoggedIn, isSignedUp}) => {
    return (
      <FullSiteLayout isLoggedIn={isLoggedIn} isSignedUp={isSignedUp}>
          <VStack> 
          {/*TODO*/} 
            <Hero/>
          </VStack>
      </FullSiteLayout>
      );
}

export default Home