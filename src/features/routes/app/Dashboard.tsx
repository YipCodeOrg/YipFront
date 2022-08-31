import { Button, Center, Heading, HStack, Icon, IconButton, Stack,
    Text, Tooltip, VStack, useColorModeValue, Link } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { FaBuilding, FaHouseUser, FaPlusCircle, FaRegEnvelope } from "react-icons/fa"
import { BsFillArrowUpRightSquareFill } from "react-icons/bs"
import { Link as RouterLink } from "react-router-dom"
import { LoadStatus } from "../../../app/types"
import { useYipCodeUrlParam } from "../../../app/urlParamHooks"
import Sidebar, { SideBarItemData, SidebarProps } from "../../../components/core/SideBar"
import { LogoLoadStateWrapper } from "../../../components/hoc/LoadStateWrapper"
import { UserAddressData } from "../../../packages/YipStackLib/types/userAddressData"
import { shrinkToParent } from "../../../util/cssHelpers"
import { useMemoisedYipCodeToAddressMap, useSortedAddressDataHubLoad } from "../../useraddressdata/userAddressDataSlice"
import { AggregatedRegistrationUpdateStatusIcon, RegistrationUpdateStatusIcon } from "./registrations/RegistrationUpdateStatusIcon"
import { Registration } from "../../../packages/YipStackLib/types/registrations"
import { MdEditNote } from "react-icons/md"
import { AddressPanel } from "../../../components/core/AddressPanel"

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

    return <LogoLoadStateWrapper status = {userAddressDataStatus} loadedElement={loadedElement}
        h="100%" flexGrow={1} justify="center" logoSize={80}/>
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
                <RouterLink to="/app/create">
                    <Button
                    rounded={'full'}
                    px={6}
                    colorScheme={'blue'}
                    bg={'blue.400'}
                    _hover={{ bg: 'blue.500' }}>                  
                        Create Address
                    </Button>
                </RouterLink>
            </Center>
        </Stack>
    </Center>
}

type DashboardContentProps = {
    selectedYipCode: string,
    selectedAddress: UserAddressData
}

const DashboardContent: React.FC<DashboardContentProps> = (props) =>{
    
    const {selectedAddress} = props
    const addressName = getDisplayLabelForAddress(selectedAddress)
    const addressLastUpdated = selectedAddress.address.addressMetadata.lastUpdated
    
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
        {/*Medium-to-large screen*/}
        <HStack align="top" spacing="15px" display={{ base: 'none', md: 'flex' }}>
            <AddressPanel {...props}/>
            <RegistrationPanel registrations={selectedAddress.registrations} addressLastUpdated={addressLastUpdated}/>
        </HStack>
        {/*Mobile*/}
        <VStack align="top" spacing="15px" display={{ base: 'flex', md: 'none' }}>
            <AddressPanel {...props}/>
            <RegistrationPanel registrations={selectedAddress.registrations} addressLastUpdated={addressLastUpdated}/>
        </VStack>
    </VStack>
}

type RegistrationPanelPrpos = {
    registrations: Registration[],
    addressLastUpdated: Date
}

const RegistrationPanel: React.FC<RegistrationPanelPrpos> = (props) => {
    const {registrations, addressLastUpdated} = props

    const editRegistrationsTooltip = "Edit registrations"
    const panelBg = useColorModeValue('gray.50', 'whiteAlpha.100')

    return <VStack id="dashboard-registration" align="left" spacing="5px"
        justify="top">
        <HStack>
            <label>Registrations</label>
            <HStack flexGrow={1}/>
            <Tooltip label={editRegistrationsTooltip} placement="top" openDelay={500}>
                <RouterLink to={"/app/registrations/edit"}>
                    <IconButton aria-label={editRegistrationsTooltip} bg="inherit">
                        <Icon as={MdEditNote}/>
                    </IconButton>
                </RouterLink>
            </Tooltip>       
            <HStack paddingRight="2">
                <AggregatedRegistrationUpdateStatusIcon {...props}/>
            </HStack>
        </HStack>
        <VStack align="left" spacing="8px" justify="top" borderRadius="lg" p="4"
            bg={panelBg}>
            {registrations.map((v, i) => <RegistrationCard registration={v} key = {i} addressLastUpdated={addressLastUpdated}/>)}
        </VStack>
    </VStack>
}

type RegistrationCardProps = {
    registration: Registration,
    addressLastUpdated: Date
}

const RegistrationCard: React.FC<RegistrationCardProps> = (props) => {
    
    const {registration } = props
    const hyperlink = registration.hyperlink
    const cardBg = useColorModeValue('gray.200', 'gray.700')

    const CardWithoutLink = () => <HStack boxShadow="lg"  maxW="400px"
    bg={cardBg} borderRadius="lg">            
        <Text p="4" flexGrow={1}>{registration.name}
        </Text>
        <VStack alignSelf="stretch" p="1">
            {hyperlink!! ?            
            <Icon as={BsFillArrowUpRightSquareFill}/>
            : <></>}
            <Stack flexGrow={1}/>
            <RegistrationUpdateStatusIcon {...props}/>
        </VStack> 
    </HStack>

    return hyperlink!! ? <Link href={hyperlink} target="_blank"><CardWithoutLink/></Link> : <CardWithoutLink/>
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