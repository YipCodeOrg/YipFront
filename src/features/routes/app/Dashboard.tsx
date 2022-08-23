import { Button, Center, Heading, HStack, Icon, IconButton, Input, Stack,
    Text, Textarea, Tooltip, useClipboard, VStack, useColorModeValue, Link, Box } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { FaBuilding, FaHouseUser, FaPlusCircle, FaRegEnvelope, FaCopy } from "react-icons/fa"
import { BsFillArrowUpRightSquareFill } from "react-icons/bs"
import { HiExclamationCircle } from "react-icons/hi"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { Link as RouterLink } from "react-router-dom"
import { LoadStatus } from "../../../app/types"
import { useYipCodeUrlParam } from "../../../app/urlParamHooks"
import { Logo } from "../../../components/core/Logo"
import Sidebar, { SideBarItemData, SidebarProps } from "../../../components/core/SideBar"
import { LogoLoadStateWrapper } from "../../../components/hoc/LoadStateWrapper"
import { isRegistrationUpToDate, Registration, UserAddressData } from "../../../packages/YipStackLib/types/userAddressData"
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
            <YipCodeAndAddressContent {...props}/>
            <RegistrationPanel registrations={selectedAddress.registrations} addressLastUpdated={addressLastUpdated}/>
        </HStack>
        {/*Mobile*/}
        <VStack align="top" spacing="15px" display={{ base: 'flex', md: 'none' }}>
            <YipCodeAndAddressContent {...props}/>
            <RegistrationPanel registrations={selectedAddress.registrations} addressLastUpdated={addressLastUpdated}/>
        </VStack>
    </VStack>
}

type YipCodeAndAddressContentProps = {
    selectedYipCode: string,
    selectedAddress: UserAddressData
}

const YipCodeAndAddressContent: React.FC<YipCodeAndAddressContentProps> = ({selectedYipCode, selectedAddress}) =>{
    
    const addressLines = selectedAddress.address.address.addressLines
    
    const { hasCopied, onCopy } = useClipboard(selectedYipCode)
    return <VStack  align="left" justify="top" maxW="100%">        
        <VStack maxW="100%" id="dashboard-yipcode" align="left">
            <HStack>
                <Logo lightCol='#000000' darkCol='#ffffff'size={17}/> 
                <label>YipCode</label>
            </HStack>
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
}

type RegistrationPanelPrpos = {
    registrations: Registration[],
    addressLastUpdated: Date
}

const RegistrationPanel: React.FC<RegistrationPanelPrpos> = ({registrations, addressLastUpdated: addressLasUpdated}) => {
    return <VStack id="dashboard-registration" align="left" spacing="5px"
        justify="top">
        <label>Registrations</label>
        <VStack align="left" spacing="8px" justify="top" borderRadius="lg" p="4"
            bg={useColorModeValue('gray.50', 'whiteAlpha.100')}>
            {registrations.map((v, i) => <RegistrationCard registration={v} key = {i} addressLastUpdated={addressLasUpdated}/>)}
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

    const CardWithoutLink = () => <HStack boxShadow="lg"  maxW="400px"
    bg={useColorModeValue('gray.200', 'gray.700')} borderRadius="lg">            
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

const RegistrationUpdateStatusIcon: React.FC<RegistrationCardProps> =
    ({registration, addressLastUpdated}) => {
    const isUpToDate = isRegistrationUpToDate(registration, addressLastUpdated)
    if(isUpToDate){
        return <Tooltip label="The address registered at this organisation is up to date.">
                <Box h="16px">
                    <Icon as={IoIosCheckmarkCircle} color="green.500"/>
                </Box>
            </Tooltip>
    } else {
        return <Tooltip label="The address registered at this organisation is out of date. Consider updating it.">
            <Box h="16px">
                <Icon as={HiExclamationCircle} color="red.500"/>
            </Box>
        </Tooltip>
    }
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