import { Outlet } from "react-router-dom";
import FullLayout from "../core/pageLayouts";

const FullRoutingLayout = () => (
    <FullLayout>
        <Outlet/>
    </FullLayout>          
);

export default FullRoutingLayout;