import { IconType } from "react-icons"
import { FaBuilding, FaHouseUser, FaPlusCircle, FaRegEnvelope } from "react-icons/fa"
import { LoadStatus } from "../../../app/types"
import { useYipCodeUrlParam } from "../../../app/urlParamHooks"
import Sidebar, { SideBarItemData, SimpleSidebarProps } from "../../../components/core/SideBar"
import { LogoLoadStateWrapper } from "../../../components/hoc/LoadStateWrapper"
import { UserAddressData } from "../../../packages/YipStackLib/types/userAddressData"
import { useSortedAddressDataHubLoad } from "../../useraddressdata/userAddressDataSlice"

export default function DashboardWrapper(){
    
    const selectedYipCode = useYipCodeUrlParam()
    const [userAddressData, userAddressDataStatus] = useSortedAddressDataHubLoad()
    return <Dashboard {...{userAddressData, userAddressDataStatus, selectedYipCode}}/>
}

export type DashboardProps = {
    userAddressData: UserAddressData[] | undefined,
    userAddressDataStatus: LoadStatus,
    selectedYipCode: string | null
}

export const Dashboard: React.FC<DashboardProps> = ({userAddressData, userAddressDataStatus, selectedYipCode}) => {

    const loadedElement = userAddressData!! ? <LoadedDashboard {...{userAddressData, selectedYipCode}}/> : <></>

    return <LogoLoadStateWrapper status = {userAddressDataStatus} loadedElement={loadedElement}/>
}

type LoadedDashboardProps = {
    userAddressData: UserAddressData[],
    selectedYipCode: string | null
}

const LoadedDashboard: React.FC<LoadedDashboardProps> = ({userAddressData, selectedYipCode}) =>{

    const sideBarProps: SimpleSidebarProps = {
        selectedItemKey: selectedYipCode,
        itemData: userAddressData.map(sideBarItemDataFromUserAddressData),
        buttonData: [{
            hoverText: "Add a new Address",
            icon: FaPlusCircle,
            link: "/app/create"
        }]
    }

    return <Sidebar {...sideBarProps}/>
}

function sideBarItemDataFromUserAddressData(userAddressData: UserAddressData) : SideBarItemData{
    const yipCode = userAddressData.yipCode
    const name = userAddressData.name ?? yipCode
    return {
        key: yipCode,
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