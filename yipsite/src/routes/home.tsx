import {
  VStack,
} from "@chakra-ui/react"
import Hero from "../hero"
import { Link } from "react-router-dom";
import PageWrapper from "../pageWrapper";

export default function Home() {
    return (
      <PageWrapper>
          <VStack>  
            <Hero/>
          </VStack>
          <Link to="/blog">Blog</Link> |{" "}
          <Link to="/about">About</Link>
      </PageWrapper>
      );
}
