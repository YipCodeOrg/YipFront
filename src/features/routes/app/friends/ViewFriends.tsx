import { Button, Center, Flex, Heading, HStack, Icon, Input, Stack,
    Tooltip, VStack, useColorModeValue, Text, IconButton, Box, Spacer } from "@chakra-ui/react"
import { LoadedFriend } from "./friends"
import { FaUserFriends } from "react-icons/fa"
import { MdExpandMore, MdExpandLess } from "react-icons/md"
import { DisclosureResult, useDisclosures, useFilter, useMapped, usePagination } from "../../../../app/hooks"
import React, { useCallback, useMemo } from "react"
import { Link as RouterLink } from "react-router-dom"
import { LoadStatus } from "../../../../app/types"
import { AddressItem } from "../../../../packages/YipStackLib/types/userAddressData"
import { LogoLoadStateWrapper } from "../../../../components/hoc/LoadStateWrapper"
import { AddressPanel, YipCodeAndCopyButton } from "../../../../components/core/AddressPanel"
import { Indexed } from "../../../../packages/YipStackLib/packages/YipAddress/util/types"
import { StyledPagination } from "../../../../components/core/StyledPagination"
import { Friend } from "../../../../packages/YipStackLib/types/friends"
import { BsChevronContract } from "react-icons/bs"

export type ViewFriendsProps = {
    friends: Friend[],
    loadedFriends: LoadedFriend[]
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
    return <VStack maxW="100%" maxH="100%" h="100%" w="100%"
    spacing={{ base: '10px', sm: '20px', md: '50px' }}>
        <ViewFriendsHeading/>
        <Center style={{flex:1}} maxW="100%">        
        <Stack spacing={6}>
            <Heading
                fontWeight={600}
                fontSize={{ base: 'l', sm: '2xl', md: '3xl' }}
                lineHeight={'110%'}>
                    You have not added any friends yet.{' '}
            </Heading>
            <Center>
                <RouterLink to="/app/friends/edit">
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
    </VStack>
}

type FriendCardProps = {
    loadedFriend: LoadedFriend
    disclosure: DisclosureResult
}

const ViewFriendsFilled: React.FC<ViewFriendsProps> = (props) => {

    const {friends, loadedFriends} = props
    const indexedFriends: Indexed<Friend>[] = useMapped(friends, (f) =>
        f.map((f, i) => {return {obj: f, index: i}}))
    const { filtered, applyFilter, clearFilter } = useFilter(indexedFriends)
    const filterFriendsTooltip = "Enter text to filter friends by name"
    const collapseAllTooltip = "Collapse all card details"
    const itemsPerPage = 20

    const {currentItems, pageCount, selectedPage, handlePageClick} = 
        usePagination(itemsPerPage, filtered)

    const { disclosures, setAllClosed } = useDisclosures(indexedFriends)


    const fuse = useCallback(function(f: Indexed<Friend>) : FriendCardProps{
        
        const index = f.index
        const disclosure = disclosures[index]
        let loadedFriend = loadedFriends[index]

        if(disclosure === undefined){
            throw new Error("Unexpected undefined data when indexing")
        }

        if(loadedFriend === undefined){
            console.warn("Unexpected undefined loaded friend data encountered - returning load failure")
            loadedFriend = {
                friend: f.obj,
                address: null,
                addressLoadStatus: LoadStatus.Failed
            }
        }

        return {
            loadedFriend,
            disclosure
        }
    }, [disclosures])

    const fusedItems = useMemo(() => currentItems.map(fuse), [currentItems, fuse])

    function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>){
        const v = e.target.value
        if(v){
            applyFilter(filterFunction(v))
        } else{
            clearFilter()
        }
    }

    function filterFunction(filterValue: string): (f: Indexed<Friend>) =>  boolean{
        return (f) => {
            const nameLower = f.obj.name.toLocaleLowerCase()
            const yipCodeLower = f.obj.yipCode.toLocaleLowerCase()
            const filterValueLower = filterValue.toLocaleLowerCase()
            return (nameLower.includes(filterValueLower) || yipCodeLower.includes(filterValueLower))
        }
    }
    return <VStack maxW="100%" maxH="100%" h="100%" w="100%"
    spacing={{ base: '10px', sm: '20px', md: '50px' }}>
        <ViewFriendsHeading/>
        <VStack w="100%" p = {{ base: 2, sm: 4, md: 8 }}>
            <HStack w="100%">
                <Box pl={4}>
                    <Tooltip label={collapseAllTooltip} placement="top" openDelay={1500}>
                        <IconButton icon={<BsChevronContract/>} aria-label="collapseAllTooltip"
                            onClick={setAllClosed}/>
                    </Tooltip>
                </Box>
                <Spacer/>
                <label>Filter: </label>
                <Tooltip label={filterFriendsTooltip} placement="top" openDelay={1500}>
                    <Input onChange={handleFilterChange} maxW="500px"/>
                </Tooltip>
                <Spacer/>
            </HStack>
            <ViewFriendsPanel {...{cardProps: fusedItems}}/>            
            <StyledPagination size="small"
                {...{
                    handlePageClick,
                    selectedPage,
                    pageCount
                }}                    
            />       
        </VStack>
   </VStack>
}

type ViewFriendsPanelProps = {
    cardProps: FriendCardProps[]
}

const ViewFriendsPanel: React.FC<ViewFriendsPanelProps> = ({cardProps}) => {
    const panelBg = useColorModeValue('gray.50', 'whiteAlpha.100')

    return <Flex w="100%" h="100%" justifyContent="flex-start" gap={{ base: 1, sm: 2, md: 3 }}
        bg={panelBg} p={{ base: 1, sm: 3, md: 5 }} borderRadius="lg" wrap="wrap"
        align="flex-start">
        {cardProps.map(p => <FriendCard {...p} key={p.loadedFriend.friend.yipCode}/>)}
    </Flex>
}

function ViewFriendsHeading(){
    return <Center>
        <Heading
            fontWeight={600}
            fontSize={{ base: 'l', sm: '2xl', md: '3xl' }}
            lineHeight={'110%'}>
            {`Friends `}
            <Icon as={FaUserFriends}/>
        </Heading>
    </Center>
}

const FriendCard: React.FC<FriendCardProps> = (props) => {
    
    const expandLabel = "Expand friend to see details"
    const cardBg = useColorModeValue('gray.300', 'gray.700')
    const { isOpen, setOpen, setClosed } = props.disclosure
    const {loadedFriend} = props
    const panelBg = useColorModeValue('gray.50', 'whiteAlpha.100')

    const friend = loadedFriend.friend
    return <VStack boxShadow="lg" maxW="400px"
        bg={cardBg} borderRadius="lg">
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
                borderTopLeftRadius="none" borderTopRightRadius="none" onClick={setOpen}>
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

