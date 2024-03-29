import { Button, Center, Flex, Heading, HStack, Icon, Stack,
    Tooltip, VStack, useColorModeValue, Text, IconButton, Box, Spacer, ButtonGroup } from "@chakra-ui/react"
import { FetchFriendsThunk, LoadedFriend } from "./friendsSlice"
import { FaUserFriends } from "react-icons/fa"
import { MdExpandMore, MdExpandLess } from "react-icons/md"
import { DisclosureResult, useDisclosureMap, useIndexFilter, usePagination } from "../../../../app/hooks"
import React, { useCallback, useMemo } from "react"
import { Link as RouterLink } from "react-router-dom"
import { LoadStatus } from "../../../../app/types"
import { AddressItem } from "../../../../packages/YipStackLib/types/address/address"
import { LogoLoadStateWrapper } from "../../../../components/hoc/LoadStateWrapper"
import { AddressPanel, YipCodeAndCopyButton } from "../../../../components/core/AddressPanel"
import { Indexed } from "../../../../packages/YipStackLib/packages/YipAddress/util/types"
import { StyledPagination } from "../../../../components/core/StyledPagination"
import { BsChevronContract } from "react-icons/bs"
import { AlphaSortButtonsContent } from "../../../../components/core/AlphaSortButtons"
import { PageWithHeading } from "../../../../components/hoc/PageWithHeading"
import { lowercaseFilterInSomeProp, TextFilter } from "../../../../components/core/TextFilter"
import { editfriendsAbs } from "../../../../components/routing/routeStrings"
import { useFriendsHubFetch } from "./friendsHooks"
import { FetchAddressThunk } from "../address/fetch/fetchAddressThunk"
import { useFetchIfNotLoaded } from "../address/fetch/fetchAddressHooks"

export type ConnectedViewFriendsProps = {
    fetchFriendsThunk: FetchFriendsThunk,
    fetchAddressThunk: FetchAddressThunk
}

export function ConnectedViewFriends(props: ConnectedViewFriendsProps){

    const { fetchFriendsThunk, fetchAddressThunk } = props
    const { sliceData, loadStatus} = useFriendsHubFetch(fetchFriendsThunk)

    function renderCard(props: ConnectedFriendCardProps){
        return <ConnectedFriendCard {...props}/>
    }

    const loadedElement = sliceData!! ? <ViewFriends {...{friends: sliceData, renderCard, fetchAddressThunk}}/>: <></>

    return <LogoLoadStateWrapper status = {loadStatus} loadedElement={loadedElement}
        h="100%" flexGrow={1} justify="center" logoSize={80}/>
}

export type ViewFriendsProps = {
    friends: LoadedFriend[],
    renderCard: (props: ConnectedFriendCardProps) => JSX.Element,
    fetchAddressThunk: FetchAddressThunk
}

export const ViewFriends: React.FC<ViewFriendsProps> = (props) => {
    const {friends} = props
    if(friends.length > 0){
        return <ViewFriendsFilled {...props}/>
    } else {
        return <ViewFriendsEmpty/>
    }
}

function ViewFriendsEmpty(){
    return <PageWithHeading heading="Friends " icon={FaUserFriends}>        
            <Center style={{flex:1}} maxW="100%">        
            <Stack spacing={6}>
                <Heading
                    fontWeight={600}
                    fontSize={{ base: 'l', sm: '2xl', md: '3xl' }}
                    lineHeight={'110%'}>
                        You have not added any friends yet.{' '}
                </Heading>
                <Center>
                    <RouterLink to={editfriendsAbs}>
                        <Button
                        rounded={'full'}
                        px={6}
                        colorScheme={'blue'}
                        bg={'blue.400'}
                        _hover={{ bg: 'blue.500' }}>                  
                            Add Friends
                        </Button>
                    </RouterLink>
                </Center>
            </Stack>
        </Center>       
    </PageWithHeading>
}

export type ConnectedFriendCardProps = {
    loadedFriend: LoadedFriend,
    disclosure: DisclosureResult,
    fetchThunk: FetchAddressThunk
}

const ViewFriendsFilled: React.FC<ViewFriendsProps> = (props) => {

    const { friends, renderCard, fetchAddressThunk: fetchThunk } = props
    const filterResult = useIndexFilter(friends)
    const { filtered, setPreFiltered, preFiltered } = filterResult
    const collapseAllTooltip = "Collapse all card details"
    const itemsPerPage = 20

    const {currentItems, pageCount, selectedPage, handlePageClick} = 
        usePagination(itemsPerPage, filtered, true)

    const { disclosures, setAllClosed } = useDisclosureMap(friends, f => f.friend.yipCode)

    const fuse = useCallback(function(f: Indexed<LoadedFriend>) : ConnectedFriendCardProps{
        
        const loadedFriend = f.obj
        const yipCode = loadedFriend.friend.yipCode
        const disclosure = disclosures[yipCode]

        if(disclosure === undefined){
            throw new Error(`Unexpected undefined disclosure for yipCode: ${yipCode}`)
        }

        return {
            loadedFriend,
            disclosure,
            fetchThunk
        }
    }, [disclosures])

    const fusedItems = useMemo(() => currentItems.map(fuse), [currentItems, fuse])

    const buttonGroupBg = useColorModeValue('gray.50', 'gray.900')

    function filterFunction(filterValue: string): (friend: LoadedFriend) =>  boolean{
        return lowercaseFilterInSomeProp(filterValue, [f => f.friend.name, 
            f => f.friend.yipCode])        
    }

    return <PageWithHeading heading="Friends " icon={FaUserFriends}> 
        <VStack w="100%" p = {{ base: 2, sm: 4, md: 8 }}>
            <HStack w="100%">
                <ButtonGroup isAttached variant='outline' bg={buttonGroupBg} borderRadius="lg">        
                    <Tooltip label={collapseAllTooltip} placement="top" openDelay={1500}>
                        <IconButton icon={<BsChevronContract/>} aria-label="collapseAllTooltip"
                            onClick={setAllClosed}/>
                    </Tooltip>
                    <AlphaSortButtonsContent setter={setPreFiltered} arr={preFiltered} sortField={f=>f.obj.friend.name}
                        sortFieldDesc="name"/>
                </ButtonGroup>
                <Spacer/>
                <TextFilter {...{filterResult, objPluralLabel: "friends", filterGenerator: filterFunction}} w="100%"
                    justify="center"/>
                <Spacer/>
            </HStack>
            <ViewFriendsPanel {...{cardProps: fusedItems, renderCard}}/>
            <StyledPagination size="small"
                {...{
                    handlePageClick,
                    selectedPage,
                    pageCount
                }}                    
            />       
        </VStack>
   </PageWithHeading>
}

type ViewFriendsPanelProps = {
    cardProps: ConnectedFriendCardProps[],
    renderCard: (props: ConnectedFriendCardProps) => JSX.Element
}

const ViewFriendsPanel: React.FC<ViewFriendsPanelProps> = ({cardProps, renderCard}) => {
    const panelBg = useColorModeValue('gray.50', 'whiteAlpha.100')

    return <Flex w="100%" h="100%" justifyContent="flex-start" gap={{ base: 1, sm: 2, md: 3 }}
        bg={panelBg} p={{ base: 1, sm: 3, md: 5 }} borderRadius="lg" wrap="wrap"
        align="flex-start">
        {cardProps.map(renderCard)}
    </Flex>
}

function ConnectedFriendCard(props: ConnectedFriendCardProps){
    
    const { fetchThunk, loadedFriend, ...rest } = props

    const loadCardData = useFetchIfNotLoaded(fetchThunk, loadedFriend)

    return <FriendCard {...{loadCardData, loadedFriend, ...rest}}/>
}

export type FriendCardProps = {
    loadedFriend: LoadedFriend,
    disclosure: DisclosureResult,
    loadCardData: () => void
}

export const FriendCard: React.FC<FriendCardProps> = (props) => {
    
    const expandLabel = "Expand friend to see details"
    const cardBg = useColorModeValue('gray.300', 'gray.700')
    const { isOpen, setOpen, setClosed } = props.disclosure
    const { loadedFriend, loadCardData } = props
    const { yipCode } = loadedFriend.friend
    const panelBg = useColorModeValue('gray.50', 'whiteAlpha.100')

    const handleCardOpen = useCallback(function(){
        loadCardData()
        setOpen()
    }, [setOpen, loadCardData])

    const friend = loadedFriend.friend
    return <VStack boxShadow="lg" maxW="400px"
        bg={cardBg} borderRadius="lg" key={yipCode}>
        <Text as="u" m={3} p={2} wordBreak="break-all" bg="inherit" fontWeight={600}
            textUnderlineOffset={5}>
            {friend.name}
        </Text>
        <VStack w="100%" pl={2} pr={2} align="left" justify="top" maxW="100%">
            <label>YipCode</label>
            <YipCodeAndCopyButton yipCode={friend.yipCode} w="100%" bg={panelBg} p={2}/>
        </VStack>
        <Box display={isOpen ? "none" : "inherit"} w="100%">
            <IconButton aria-label={expandLabel} w="100%"
                borderTopLeftRadius="none" borderTopRightRadius="none" onClick={handleCardOpen}>
                <Icon as={MdExpandMore}/>
            </IconButton>
        </Box>
        <VStack display={isOpen ? "inherit" : "none"} w="100%">
            <ExpandedCardContent {...props}/>
            <IconButton aria-label={expandLabel} w="100%"
                borderTopLeftRadius="none" borderTopRightRadius="none" onClick={setClosed}>
                <Icon as={MdExpandLess}/>
            </IconButton>
        </VStack>
    </VStack>
}

const ExpandedCardContent: React.FC<FriendCardProps> = ({loadedFriend}) => {

    const {address, addressLoadStatus} = loadedFriend
    const loadedContent = addressLoadStatus === LoadStatus.Loaded && address!!?
        <LoadedCardContent {...{addressItem: address}}/> :
        <></>
    return <LogoLoadStateWrapper loadedElement={loadedContent} status={addressLoadStatus}
        p={2} logoSize={40}/>
}

export type LoadedCardContentProps = {
    addressItem: AddressItem
}

const LoadedCardContent: React.FC<LoadedCardContentProps> = ({addressItem}) => {    
    return <Box p={2}>
        <AddressPanel addressItem={addressItem} displayYipCode={false}/>
    </Box>
}