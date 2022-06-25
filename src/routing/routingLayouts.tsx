import { ChakraProvider, theme } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import {FullSiteLayout, FullAppLayout} from "../core/pageLayouts";

export const FullSiteRoutingLayout = () => (
    <FullSiteLayout>
        <Outlet/>
    </FullSiteLayout>          
);

export const FullAppRoutingLayout  = () => (
    <FullAppLayout>
        <Outlet/>
    </FullAppLayout>          
);

export const TopLevelRoutingLayout = () => (    
    <ChakraProvider theme={theme}>
        <Outlet/>
    </ChakraProvider>            
);