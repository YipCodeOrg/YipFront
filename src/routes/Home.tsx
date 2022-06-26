import {
  VStack,
} from "@chakra-ui/react"
import Hero from "../core/Hero"
import { FullSiteLayout } from "../core/pageLayouts"

type HomeProps = {
  isLoggedIn: boolean
  isSignedUp: boolean
  setIsSigedUp: (b: boolean) => void
}

const Home: React.FC<HomeProps> = ({isLoggedIn, isSignedUp, setIsSigedUp}) => {
    return (
      <FullSiteLayout isLoggedIn={isLoggedIn} isSignedUp={isSignedUp} setIsSigedUp={setIsSigedUp}>
          <VStack> 
          {/*TODO*/} 
            <Hero/>
          </VStack>
      </FullSiteLayout>
      );
}

export default Home