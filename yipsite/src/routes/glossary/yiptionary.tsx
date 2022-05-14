import { Box, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Yiptionary(){
    return <VStack>
        <Link to="/glossary">Up to Glossary</Link>
        <Box>Yiptionary</Box>                
    </VStack>
}