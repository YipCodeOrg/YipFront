import { Box, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Glossary(){
    return <VStack>
        {/*TODO*/}
        <Box>We're compiling our glossary - stay tuned!</Box>
        <Link to="/site/glossary/yiptionary"> Down to Yiptionary</Link>
    </VStack>
}