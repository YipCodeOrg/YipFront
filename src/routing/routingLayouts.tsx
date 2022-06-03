import { ChakraProvider, theme } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import FullLayout from "../core/pageLayouts";

const FullRoutingLayout = () => (
    <FullLayout>
        <Outlet/>
    </FullLayout>          
);

export const TopLevelRoutingLayout = () => (    
    <ChakraProvider theme={theme}>
        <Outlet/>
    </ChakraProvider>            
);

export default FullRoutingLayout;