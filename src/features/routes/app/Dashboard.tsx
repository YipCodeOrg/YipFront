import { Button, Center, Heading, HStack, Icon, IconButton, Input, Stack, Text, Textarea, Tooltip, useClipboard, VStack } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { FaBuilding, FaHouseUser, FaPlusCircle, FaRegEnvelope, FaCopy } from "react-icons/fa"
import { Link } from "react-router-dom"
import { LoadStatus } from "../../../app/types"
import { useYipCodeUrlParam } from "../../../app/urlParamHooks"
import Sidebar, { SideBarItemData, SidebarProps } from "../../../components/core/SideBar"
import { LogoLoadStateWrapper } from "../../../components/hoc/LoadStateWrapper"
import { UserAddressData } from "../../../packages/YipStackLib/types/userAddressData"
import { growFlexProps, shrinkToParent } from "../../../util/cssHelpers"
import { useMemoisedYipCodeToAddressMap, useSortedAddressDataHubLoad } from "../../useraddressdata/userAddressDataSlice"

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
    
    const addressMap = useMemoisedYipCodeToAddressMap(userAddressData)

    const sideBarProps: SidebarProps = {
        selectedItemKey: selectedYipCode,
        itemData: userAddressData.map(sideBarItemDataFromUserAddressData),
        buttonData: [{
            hoverText: userAddressData.length > 0 ? "Create another address" : "Create an address",
            icon: FaPlusCircle,
            link: "/app/create"
        }]
    }

    let selectedAddress: UserAddressData | null = null
    if(selectedYipCode != null && addressMap.has(selectedYipCode)){
        selectedAddress = addressMap.get(selectedYipCode) ?? null
    }

    return <HStack style={shrinkToParent} width="100%" maxW="100%" id="loaded-dashboard">
        <Sidebar {...sideBarProps}/>
        {!!selectedAddress && !!selectedYipCode ?
            <DashboardContent {...{selectedYipCode, selectedAddress}}/> :
            <EmptyDashboardContent/>
        }        
    </HStack>
}

const EmptyDashboardContent = () => {
    return <Center style={{flex:1}} maxW="100%">        
        <Stack spacing={6}>
            <Heading
                fontWeight={600}
                fontSize={{ base: 'l', sm: '2xl', md: '3xl' }}
                lineHeight={'110%'}>
                    You have no addresses yet!{' '}
            </Heading>
            <Center>
                <Link to="/app/create">
                    <Button
                    rounded={'full'}
                    px={6}
                    colorScheme={'blue'}
                    bg={'blue.400'}
                    _hover={{ bg: 'blue.500' }}>                  
                        Create Address
                    </Button>
                </Link>
            </Center>
        </Stack>
    </Center>
}

type DashboardContentProps = {
    selectedYipCode: string,
    selectedAddress: UserAddressData
}

const DashboardContent: React.FC<DashboardContentProps> = ({selectedYipCode, selectedAddress}) =>{
    
    const { hasCopied, onCopy } = useClipboard(selectedYipCode)
    
    const addressLines = selectedAddress.address.addressLines
    const addressName = getDisplayLabelForAddress(selectedAddress)
    
    return <VStack maxW="100%" maxH="100%" height="100%"
            id="dashboard-content" style={{flex:1}} align="left" spacing={{ base: '10px', sm: '20px', md: '50px' }}>
        <Center>
            {/*TODO: Delete button. Maybe use ButtonGroup & add an edit button there too?*/}
            <Heading
                fontWeight={600}
                fontSize={{ base: 'l', sm: '2xl', md: '3xl' }}
                lineHeight={'110%'}>
                {`${addressName}    `}
                <Icon as={getIconFromName(addressName)}/>
            </Heading>
        </Center>
        <HStack align="top" spacing="15px">
            <VStack  align="left" justify="top" maxW="100%">        
                <VStack maxW="100%" id="dashboard-yipcode" align="left">
                    <label>YipCode</label>
                    <HStack>
                        <Input readOnly={true} value={selectedYipCode}/>
                        {/*Non-MVP: Make tooltip disappear a fraction of a second after it's copied*/}
                        <Tooltip label={hasCopied ? "YipCode Copied" : "Copy YipCode"} closeOnClick={false}>
                            <IconButton aria-label={"Click on this button to copy the YipCode to your clipboard"}
                                icon={<FaCopy/>} onClick={onCopy}/>
                        </Tooltip>
                    </HStack>
                </VStack>
                <VStack id="dashboard-address" align="left">
                    <label>Address</label>
                    <Textarea style={growFlexProps} rows={addressLines.length} readOnly={true}
                        value={addressLines.join("\n")} resize="both"/>
                </VStack>
            </VStack>
            <RegistrationPanel registrations={selectedAddress.registrations}/>
        </HStack>
    </VStack>
}

type RegistrationPanelPrpos = {
    registrations: string[]
}

const RegistrationPanel: React.FC<RegistrationPanelPrpos> = ({registrations}) => {
    return <VStack id="dashboard-registration" align="left" spacing="5px" justify="top" display={{ base: 'none', md: 'block' }}>
        <label>Registrations</label>
        <VStack align="left" spacing="8px" justify="top">
            {registrations.map((v, i) => <RegistrationCard registration={v} key = {i}/>)}
        </VStack>
    </VStack>
}

type RegistrationCardProps = {
    registration: string
}

const RegistrationCard: React.FC<RegistrationCardProps> = ({registration}) => {
    return (
        <Stack p="4" boxShadow="lg" borderRadius="lg" borderWidth="1px" maxW="400px">
            <Text fontWeight="semibold">{registration}</Text>
        </Stack>
    )
}

function sideBarItemDataFromUserAddressData(userAddressData: UserAddressData) : SideBarItemData{
    const yipCode = userAddressData.yipCode
    const name = getDisplayLabelForAddress(userAddressData)
    return {
        key: yipCode,
        name,
        icon: getIconFromName(name),
        link: `/app?yipcode=${yipCode}`
    }
}

function getDisplayLabelForAddress(userAddressData: UserAddressData){
    return userAddressData.name ?? userAddressData.yipCode
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