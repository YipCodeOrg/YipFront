import { Button, Center, Heading, HStack, Icon, IconButton, Stack,
    Text, Tooltip, VStack, useColorModeValue, Link, Spacer } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { FaBuilding, FaHouseUser, FaPlusCircle, FaRegEnvelope } from "react-icons/fa"
import { BsFillArrowUpRightSquareFill } from "react-icons/bs"
import { Link as RouterLink } from "react-router-dom"
import { LoadStatus } from "../../../app/types"
import { useYipCodeUrlParam } from "../../../app/urlParamHooks"
import Sidebar, { SideBarItemData, SidebarProps } from "../../../components/core/SideBar"
import { LogoLoadStateWrapper } from "../../../components/hoc/LoadStateWrapper"
import { UserAddressData } from "../../../packages/YipStackLib/types/address/address"
import { shrinkToParent } from "../../../util/cssHelpers"
import { deleteAddress, DeleteAddressData, DeleteAddressThunk, fetchUserAddressData, UserAddressSliceData } from "../../useraddressdata/userAddressDataSlice"
import { AggregatedRegistrationUpdateStatusIcon, RegistrationUpdateStatusIcon } from "./registrations/RegistrationUpdateStatusIcon"
import { Registration } from "../../../packages/YipStackLib/types/registrations"
import { MdEditNote } from "react-icons/md"
import { AddressPanel } from "../../../components/core/AddressPanel"
import { PageWithHeading } from "../../../components/hoc/PageWithHeading"
import { AsyncThunk } from "@reduxjs/toolkit"
import { UserData } from "../../../packages/YipStackLib/types/userData"
import { fetchUserData } from "../../userdata/userDataSlice"
import { simpleDateToDate } from "../../../packages/YipStackLib/packages/YipAddress/util/date"
import { ConfirmationPopoverButton } from "../../../components/core/ConfirmationPopoverButton"
import { useThunkDispatch } from "../../../app/hooks"
import { useCallback, useMemo } from "react"
import { useMemoisedYipCodeToAddressMap, useSortedAddressDataHubFetch } from "../../useraddressdata/userAddressDataHooks"

export default function DashboardWrapper(){
    
    const selectedYipCode = useYipCodeUrlParam()
    return <ConnectedDashboard {...{selectedYipCode}}
        userAddressDataThunk={fetchUserAddressData}
        userDataThunk={fetchUserData}
        deleteAddressThunk={deleteAddress} />
}

export type ConnectedDashboardProps = {
    selectedYipCode: string | null,
    userAddressDataThunk: AsyncThunk<UserAddressSliceData[], MessagePort, {}>,
    userDataThunk: AsyncThunk<UserData, MessagePort, {}>
    deleteAddressThunk: DeleteAddressThunk
}

export function ConnectedDashboard(props: ConnectedDashboardProps){

    const { selectedYipCode, userAddressDataThunk, userDataThunk, deleteAddressThunk} = props    
    const [userAddressData, userAddressDataStatus] = useSortedAddressDataHubFetch(userAddressDataThunk, userDataThunk)

    const deleteAddress = useThunkDispatch(deleteAddressThunk)

    return <Dashboard {...{userAddressData, userAddressDataStatus, selectedYipCode, deleteAddress}}/>    
}

export type DashboardProps = {
    userAddressData: UserAddressSliceData[] | undefined,
    userAddressDataStatus: LoadStatus,
    selectedYipCode: string | null,
    deleteAddress: (data: DeleteAddressData) => void
}

export const Dashboard: React.FC<DashboardProps> = (props) => {

    const {userAddressData, userAddressDataStatus, selectedYipCode, deleteAddress} = props

    const loadedElement = userAddressData!! ? <LoadedDashboard {...{userAddressData,
        selectedYipCode, deleteAddress}}/> : <></>    

    return <LogoLoadStateWrapper status = {userAddressDataStatus} loadedElement={loadedElement}
        h="100%" flexGrow={1} justify="center" logoSize={80}/>
}

type LoadedDashboardProps = {
    userAddressData: UserAddressSliceData[],
    selectedYipCode: string | null,
    deleteAddress: (data: DeleteAddressData) => void
}

const LoadedDashboard: React.FC<LoadedDashboardProps> = (props) =>{
    
    const {userAddressData, selectedYipCode, deleteAddress} = props
    const addressMap = useMemoisedYipCodeToAddressMap(userAddressData)

    function getEffectiveSelectedYipcode(){
        if(selectedYipCode !== null && addressMap.has(selectedYipCode)){
            return selectedYipCode
        }
        const [firstYipCode] = addressMap.keys()
        return firstYipCode ?? null
    }

    const effectiveSelectedYipcode = useMemo(getEffectiveSelectedYipcode, [selectedYipCode, addressMap])

    const sideBarProps: SidebarProps = {
        selectedItemKey: effectiveSelectedYipcode,
        itemData: userAddressData.map(sideBarItemDataFromUserAddressData),
        buttonData: [{
            hoverText: userAddressData.length > 0 ? "Create another address" : "Create an address",
            icon: FaPlusCircle,
            link: "/app/create"
        }]
    }

    let selectedAddress: UserAddressSliceData | null = null
    if(effectiveSelectedYipcode != null && addressMap.has(effectiveSelectedYipcode)){
        selectedAddress = addressMap.get(effectiveSelectedYipcode) ?? null
    }

    return <HStack style={shrinkToParent} width="100%" maxW="100%" id="loaded-dashboard">
        <Sidebar {...sideBarProps}/>
        {!!selectedAddress ?
            <DashboardContent {...{selectedAddressData: selectedAddress, deleteAddress}}/> :
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
    selectedAddressData: UserAddressSliceData,
    deleteAddress: (data: DeleteAddressData) => void
}

const DashboardContent: React.FC<DashboardContentProps> = (props) =>{
    
    const { selectedAddressData, deleteAddress } = props
    const { addressData, isDeleting } = selectedAddressData
    const addressName = getDisplayLabelForAddress(addressData)
    const addressLastUpdated = simpleDateToDate(addressData.address.addressMetadata.lastUpdated)

    const deleteThisAddress = useCallback(function(){
        const yipCode = selectedAddressData.addressData.address.yipCode
        deleteAddress({yipCode})
    }, [selectedAddressData, deleteAddress])

    return <PageWithHeading heading={`${addressName}    `} icon={getIconFromName(addressName)}>
        {/*Medium-to-large screen*/}
        <HStack align="flex-start" spacing="15px" display={{ base: 'none', md: 'inherit' }} p={4}>
            <AddressPanel addressItem={addressData.address} displayYipCode={true} maxW="500px"/>
            <RegistrationPanel registrations={addressData.registrations} addressLastUpdated={addressLastUpdated}/>
            <ButtonPanel {...{isDeleting}} deleteAddress={deleteThisAddress}/>
        </HStack>
        {/*Mobile*/}
        <VStack align="top" spacing="15px" display={{ base: 'inherit', md: 'none' }} p={2}>
            <AddressPanel addressItem={addressData.address} displayYipCode={true}/>
            <RegistrationPanel registrations={addressData.registrations} addressLastUpdated={addressLastUpdated}/>
            <ButtonPanel {...{isDeleting}} deleteAddress={deleteThisAddress}/>
        </VStack>
    </PageWithHeading>
}

type ButtonPanelProps = {
    isDeleting: boolean,
    deleteAddress: () => void
}

function ButtonPanel(props: ButtonPanelProps){
    const { isDeleting, deleteAddress } = props
    const confirmButtonBg = useColorModeValue('gray.100', 'gray.800')
    const popoverBodyMessage = "Are you sure that you want to delete this address?"        
    const buttonLabel = isDeleting ? "Deleting..." : "Delete"
    
    return <VStack align="left" spacing="5px" justify="top">
        <HStack justify="left" w="100%">
            <label>Actions</label>
            <Spacer/>
        </HStack>
        <ConfirmationPopoverButton action={deleteAddress}
            {...{confirmButtonBg, popoverBodyMessage, buttonLabel}}
            isDisabled={isDeleting} actionName="Delete"/>
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
        <HStack align="flex-start">
            <label>Registrations</label>
            <Spacer/>
            <HStack paddingRight="2">
                <Tooltip label={editRegistrationsTooltip} placement="top" openDelay={500}>
                    <RouterLink to={"/app/registrations/edit"}>
                        <IconButton aria-label={editRegistrationsTooltip} bg="inherit">
                            <Icon as={MdEditNote}/>
                        </IconButton>
                    </RouterLink>
                </Tooltip>       
                <AggregatedRegistrationUpdateStatusIcon {...props}/>
            </HStack>
        </HStack>
        <VStack align="left" spacing="8px" justify="top" borderRadius="lg" p="4"
            bg={panelBg}>
            {registrations.map((r, i) => <RegistrationCard registration={r} key={`${r.name}${i}`} addressLastUpdated={addressLastUpdated}/>)}
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

function sideBarItemDataFromUserAddressData(userAddressData: UserAddressSliceData) : SideBarItemData{
    const yipCode = userAddressData.addressData.address.yipCode
    const name = getDisplayLabelForAddress(userAddressData.addressData)
    return {
        key: yipCode,
        name,
        icon: getIconFromName(name),
        link: `/app?yipcode=${yipCode}`
    }
}

function getDisplayLabelForAddress(userAddressData: UserAddressData){
    return userAddressData.name ?? userAddressData.address.yipCode
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