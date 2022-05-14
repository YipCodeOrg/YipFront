import { Box, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Glossary(){
    return <VStack>
        <Box>Glossary</Box>
        <Link to="/glossary/yiptionary"> Down to Yiptionary</Link>
    </VStack>
}