import {
  VStack,
} from "@chakra-ui/react"
import Hero from "../hero"
import { Link } from "react-router-dom";

export default function Home() {
    return (
      <>
          <VStack>  
            <Hero/>
          </VStack>
          <Link to="/blog">Blog</Link> |{" "}
          <Link to="/about">About</Link> |{" "}
          <Link to="/glossary">Glossary</Link>
      </>
      );
}
