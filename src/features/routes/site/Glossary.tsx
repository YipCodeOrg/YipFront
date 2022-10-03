import { Box, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { yiptionaryAbs } from "../../../components/routing/routeStrings";

export default function Glossary(){
    return <VStack>
        {/*TODO*/}
        <Box>We're compiling our glossary - stay tuned!</Box>
        <Link to={yiptionaryAbs}> Down to Yiptionary</Link>
    </VStack>
}