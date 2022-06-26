import { ChakraProvider, theme } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import {FullSiteLayout, FullAppLayout} from "../core/pageLayouts";

type RoutingLayoutProps = {
    isLoggedIn: boolean
    isSignedUp: boolean
    setIsSigedUp: (b: boolean) => void
  }

export const FullSiteRoutingLayout: React.FC<RoutingLayoutProps> = ({isLoggedIn, isSignedUp, setIsSigedUp}) => (
    <FullSiteLayout isLoggedIn={isLoggedIn} isSignedUp={isSignedUp} setIsSigedUp={setIsSigedUp}>
        <Outlet/>
    </FullSiteLayout>          
);

export const FullAppRoutingLayout: React.FC<RoutingLayoutProps> = ({isLoggedIn, isSignedUp, setIsSigedUp}) => (
    <FullAppLayout isLoggedIn={isLoggedIn} isSignedUp={isSignedUp} setIsSigedUp={setIsSigedUp}>
        <Outlet/>
    </FullAppLayout>          
);

export const TopLevelRoutingLayout = () => (    
    <ChakraProvider theme={theme}>
        <Outlet/>
    </ChakraProvider>            
);