import { Button, Center, Flex, Heading, HStack, Icon, Input, Stack,
    Tooltip, VStack, useColorModeValue, Text, IconButton, Box } from "@chakra-ui/react"
import { LoadedFriend } from "./friends"
import { FaUserFriends } from "react-icons/fa"
import { MdExpandMore, MdExpandLess } from "react-icons/md"
import { DisclosureResult, useDisclosures, useFilter, useMapped } from "../../../../app/hooks"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { LoadStatus } from "../../../../app/types"
import { AddressItem } from "../../../../packages/YipStackLib/types/userAddressData"
import { LogoLoadStateWrapper } from "../../../../components/hoc/LoadStateWrapper"
import { AddressPanel } from "../../../../components/core/AddressPanel"
import ReactPaginate from "react-paginate"
import styled from "@emotion/styled"
import { Indexed } from "../../../../packages/YipStackLib/packages/YipAddress/util/types"

export type ViewFriendsProps = {
    friends: LoadedFriend[]
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

type StyledPaginationWrapperProps = {
    size: "small" | "medium" | "large",
    textColor: string,
    buttonColor: string,
    selectedButtonColor: string
}

const StyledPaginationWrapper = styled(HStack)<StyledPaginationWrapperProps>`
  ul {
    display: flex;
    w:100%;
    list-style: none;
    flex-wrap: wrap;

    li {

      a {
        display: flex;
        justify-content: center;
        text-align: center;
        padding: ${props => props.size === "small" ? "7px 9px" : props.size === "medium" ? "10px 12px" : "12px 15px"};
        font-size: ${props => props.size};
        font-weight: 600;
        line-height: 100%;
        outline: none;
        margin: ${props => props.size === "small" ? "0 5px 5px 0" : props.size === "medium" ? "0 8px 8px 0" : "0 13px 13px 0"};;
        cursor: pointer;
      }

      &:not(.break) a {
        color: ${props => props.textColor};
        background-color: ${props => props.buttonColor};
        border-radius: ${props => props.size === "small" ? "3px" : props.size === "medium" ? "5px" : "8px"};
        &:hover {
          background-color: #00B5D8;
        }
      }

      &.selected a {
        outline: solid;
        outline-color: #63b3ed;
        background-color: ${props => props.selectedButtonColor};
      }

      &.disabled a,
      &.disabled a:hover {
        cursor: default;
        background-color: #3d3d3d;
        color: #818181;
      }
    }
  }
`

type FriendCardProps = {
    loadedFriend: LoadedFriend
    disclosure: DisclosureResult
}

const ViewFriendsFilled: React.FC<ViewFriendsProps> = (props) => {

    const {friends} = props
    const indexedFriends: Indexed<LoadedFriend>[] = useMapped(friends, (f) =>
        f.map((f, i) => {return {obj: f, index: i}}))
    const { filtered, applyFilter, clearFilter } = useFilter(indexedFriends)
    const filterFriendsTooltip = "Enter text to filter friends by name"

    /// START PAGINATION STUFF

    const itemsPerPage = 20

    const [currentItems, setCurrentItems] = useState<Indexed<LoadedFriend>[]>([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [selectedPage, setSelectedPage] = useState(0)

    useEffect(() => {
        const effectiveOffset = itemOffset 
        const endOffset = effectiveOffset + itemsPerPage
        setCurrentItems(filtered.slice(effectiveOffset, endOffset))
        setPageCount(Math.ceil(filtered.length / itemsPerPage))
      }, [itemOffset, itemsPerPage, filtered])

      useEffect(() => {
        setSelectedPage(0)
        setItemOffset(0)
      }, [filtered, setSelectedPage, setItemOffset])

    const handlePageClick = (event: { selected: number }) => {
        const newPage = event.selected 
        const newOffset = newPage * itemsPerPage % filtered.length        
        setItemOffset(newOffset)
        setSelectedPage(newPage)
    }

    /// END PAGINATION STUFF

    /// START PAGINATION COMPONENT STUFF

    const textColor = useColorModeValue('#000000', '#ffffff')
    const buttonColor = useColorModeValue('#CBD5E0', '#4A5568')
    const selectedButtonColor = useColorModeValue('#EDF2F7', '#171923')

    /// END PAGINATION COMPONENT STUFF

    const disclosures = useDisclosures(indexedFriends)

    const fuse = useCallback(function(f: Indexed<LoadedFriend>) : FriendCardProps{
        
        const disclosure = disclosures[f.index]

        if(disclosure === undefined){
            throw new Error("Unexpected undefined disclosure when indexing")
        }

        return {
            loadedFriend: f.obj,
            disclosure
        }
    }, [disclosures])

    const fusedItems = useMemo(() => currentItems.map(fuse), [currentItems, fuse])

    function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>){
        const v = e.target.value
        if(v){
            applyFilter(t => t.obj.friend.name.toLocaleLowerCase().includes(v.toLocaleLowerCase()))
        } else{
            clearFilter()
        }
    }

    return <VStack maxW="100%" maxH="100%" h="100%" w="100%"
    spacing={{ base: '10px', sm: '20px', md: '50px' }}>
        <ViewFriendsHeading/>
        <VStack w="100%" p = {{ base: 2, sm: 4, md: 8 }}>
            <HStack>
                <label>Filter: </label>
                <Tooltip label={filterFriendsTooltip} placement="top" openDelay={1500}>
                    <Input onChange={handleFilterChange}/>
                </Tooltip>
            </HStack>
            <ViewFriendsPanel {...{cardProps: fusedItems}}/>            
            <StyledPaginationWrapper size="small" {...{textColor, buttonColor, selectedButtonColor}}>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    forcePage={selectedPage}
                />
            </StyledPaginationWrapper>                        
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

    return <VStack boxShadow="lg" maxW="400px"
        bg={cardBg} borderRadius="lg">
        <Text as="u" m={3} p={2} wordBreak="break-all" bg="inherit" fontWeight={600}
            textUnderlineOffset={5}>
            {loadedFriend.friend.name}
        </Text>
        <Box display={isOpen ? "none" : "inherit"} w="100%">
            <IconButton aria-label={expandLabel} w="100%"
                borderTopLeftRadius="none" borderTopRightRadius="none" onClick={setOpen}>
                <Icon as={MdExpandMore}/>
            </IconButton>
        </Box>
        <VStack display={isOpen ? "inherit" : "none"} w="100%">
            <CardContent {...props}/>
            <IconButton aria-label={expandLabel} w="100%"
                borderTopLeftRadius="none" borderTopRightRadius="none" onClick={setClosed}>
                <Icon as={MdExpandLess}/>
            </IconButton>
        </VStack>
    </VStack>
}

const CardContent: React.FC<FriendCardProps> = ({loadedFriend}) => {

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
        <AddressPanel addressItem={addressItem}/>
    </Box>
}

