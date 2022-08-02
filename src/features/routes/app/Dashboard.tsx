import { Box, Button, VStack } from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { LogoLoadStateWrapper } from "../../../components/hoc/LoadStateWrapper"
import { serialize } from "../../../packages/YipStackLib/util/misc"
import { useUserAddressDataHubLoad } from "../../useraddressdata/userAddressDataSlice"
import { useUserDataHubLoad } from "../../userdata/userDataSlice"

export default function Dashboard(){
    
    const [userData, userDataStatus] = useUserDataHubLoad()
    const [userAddressData, userAddressDataStatus] = useUserAddressDataHubLoad()
    
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