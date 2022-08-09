import { IconType } from "react-icons"
import { FaBuilding, FaHouseUser, FaPlusCircle, FaRegEnvelope } from "react-icons/fa"
import { LoadStatus } from "../../../app/types"
import SimpleSidebar, { SideBarItemData, SimpleSidebarProps } from "../../../components/core/SideBar"
import { LogoLoadStateWrapper } from "../../../components/hoc/LoadStateWrapper"
import { UserAddressData } from "../../../packages/YipStackLib/types/userAddressData"
import { useSortedAddressDataHubLoad } from "../../useraddressdata/userAddressDataSlice"

export default function DashboardWrapper(){
    
    const [userAddressData, userAddressDataStatus] = useSortedAddressDataHubLoad()
    return <Dashboard {...{userAddressData, userAddressDataStatus}}/>
}

export type DashboardProps = {
    userAddressData: UserAddressData[] | undefined,
    userAddressDataStatus: LoadStatus
}

export const Dashboard: React.FC<DashboardProps> = ({userAddressData, userAddressDataStatus}) => {

    const loadedElement = userAddressData!! ? <LoadedDashboard {...{userAddressData}}/> : <></>

    return <LogoLoadStateWrapper status = {userAddressDataStatus} loadedElement={loadedElement}/>
}

const LoadedDashboard: React.FC<{userAddressData: UserAddressData[]}> = ({userAddressData}) =>{
    
    const sideBarProps: SimpleSidebarProps = {
        itemData: userAddressData.map(sideBarItemDataFromUserAddressData),
        buttonData: [{
            hoverText: "Add a new Address",
            icon: FaPlusCircle,
            link: "/app/create"
        }]
    }

    return <SimpleSidebar {...sideBarProps}/>
}

function sideBarItemDataFromUserAddressData(userAddressData: UserAddressData) : SideBarItemData{
    const name = userAddressData.name ?? userAddressData.yipCode
    return {
        name,
        icon: getIconFromName(name),
        link: "TODO"
    }
}

function getIconFromName(name: string): IconType{
    const lowerName = name.toLowerCase()
    if(lowerName.includes("home")){
        return FaHouseUser
    }
    if(lowerName.includes("work")){
        return FaBuilding
    }
    return FaRegEnvelope
}