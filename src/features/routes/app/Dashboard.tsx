import { Box, Button, VStack } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { LoadStatus } from "../../../app/types"
import { LogoLoadStateWrapper } from "../../../components/hoc/LoadStateWrapper"
import { UserAddressData } from "../../../packages/YipStackLib/types/userAddressData"
import { UserData } from "../../../packages/YipStackLib/types/userData"
import { serialize } from "../../../packages/YipStackLib/util/misc"
import { useUserAddressDataHubLoad } from "../../useraddressdata/userAddressDataSlice"
import { useUserDataHubLoad } from "../../userdata/userDataSlice"

export default function DashboardWrapper(){
    
    const [userData, userDataStatus] = useUserDataHubLoad()
    const [userAddressData, userAddressDataStatus] = useUserAddressDataHubLoad()
    return <Dashboard {...{userData, userDataStatus, userAddressData, userAddressDataStatus}}/>
}

export type DashboardProps = {
    userData: UserData | undefined,
    userDataStatus: LoadStatus,
    userAddressData: UserAddressData[] | undefined,
    userAddressDataStatus: LoadStatus
}

export const Dashboard: React.FC<DashboardProps> = ({userData, userDataStatus, userAddressData, userAddressDataStatus}) => {

    const yipCodesText = "YipCodes: " + userData!! ? userData?.data.yipCodes.join(", ") : "None"
    const addressDataText = "User address data: " + userAddressData!! ? serialize(userAddressData) : "Undefined"

    return <VStack>
        <Link to="/app/create">
            <Button>Create</Button>
        </Link>
        <Box>
            <LogoLoadStateWrapper status = {userDataStatus} loadedElement={<>{yipCodesText}</>}></LogoLoadStateWrapper>
        </Box>
        <Box>
            <LogoLoadStateWrapper status = {userAddressDataStatus} loadedElement={<>{addressDataText}</>}></LogoLoadStateWrapper>
        </Box>
    </VStack> 

}