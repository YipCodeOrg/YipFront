import { ChakraProvider, theme } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import {FullSiteLayout, FullAppLayout} from "../core/pageLayouts";

type RoutingLayoutProps = {
    isLoggedIn: boolean,
    isSignedUp: boolean,
  }

export const FullSiteRoutingLayout: React.FC<RoutingLayoutProps> = ({isLoggedIn, isSignedUp}) => (
    <FullSiteLayout isLoggedIn={isLoggedIn} isSignedUp={isSignedUp}>
        <Outlet/>
    </FullSiteLayout>          
);

export const FullAppRoutingLayout: React.FC<RoutingLayoutProps> = ({isLoggedIn, isSignedUp}) => (
    <FullAppLayout isLoggedIn={isLoggedIn} isSignedUp={isSignedUp}>
        <Outlet/>
    </FullAppLayout>          
);

export const TopLevelRoutingLayout = () => (    
    <ChakraProvider theme={theme}>
        <Outlet/>
    </ChakraProvider>            
);