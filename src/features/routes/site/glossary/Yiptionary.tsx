import { Box, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { glossaryAbs } from "../../../../components/routing/routeStrings";

export default function Yiptionary(){
    return <VStack>
        {/*TODO*/}
        <Link to={glossaryAbs}>Up to Glossary</Link>
        <Box>Yiptionary</Box>                
    </VStack>
}