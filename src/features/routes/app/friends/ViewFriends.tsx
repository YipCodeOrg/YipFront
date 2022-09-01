import { Button, Center, Flex, Heading, HStack, Icon, Input, Stack,
    Tooltip, VStack, useColorModeValue, Text, IconButton, useDisclosure, Box, Spacer } from "@chakra-ui/react"
import { LoadedFriend } from "./friends"
import { FaUserFriends } from "react-icons/fa"
import { MdExpandMore, MdExpandLess } from "react-icons/md"
import { useFilter } from "../../../../app/hooks"
import React, { useEffect, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { LoadStatus } from "../../../../app/types"
import { AddressItem } from "../../../../packages/YipStackLib/types/userAddressData"
import { LogoLoadStateWrapper } from "../../../../components/hoc/LoadStateWrapper"
import { AddressPanel } from "../../../../components/core/AddressPanel"
import ReactPaginate from "react-paginate"
import styled from "@emotion/styled"

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
    size: "small" | "medium" | "large"
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
        outline: none;
      }

      &:not(.break) a {
        color: #000;
        box-shadow: inset 8px 0 4px -8px #000, inset -8px 0 4px -8px #000,
          inset 0 10px 2px -8px #e3e3e3, inset 0 10px 2px -8px #282828, inset 0 -9px 2px -8px #000,
          0 0 4px 0 #000;
        background-color: #8e8e8e;

        &:hover,
        &:focus {
          color: #000;
          text-decoration: none;
          outline: 0;
          box-shadow: inset 8px 0 4px -8px #000, inset -8px 0 4px -8px #000,
            inset 0 9px 2px -8px #fff, inset 0 8px 4px -8px #000, inset 0 -8px 4px -8px #000,
            inset 0 -9px 2px -8px #432400, 0 0 4px 0 #000, inset 0 0 4px 2px #f9b44b;
          background-color: #e39827;
          filter: drop-shadow(0 0 2px #f9b44b);
        }
      }

      &.selected a {
        position: relative;
        padding-top: 12px;
        padding-bottom: 8px;
        box-shadow: inset 0 10px 2px -8px #000, inset 0 9px 2px -8px #000,
          inset 8px 0 4px -8px #563a10, inset 8px 0 4px -8px #563a10, inset -8px 0 4px -8px #563a10,
          inset -8px 0 4px -8px #563a10, inset 0 9px 2px -8px #563a10, inset 0 -9px 2px -8px #563a10,
          inset 0 -8.5px 0 -8px #563a10, 0 0 4px 0 #000;
        background-color: #f1be64;
        filter: none;
        outline: 0;
      }

      &.disabled a,
      &.disabled a:hover {
        cursor: default;
        filter: none;
        background-color: #3d3d3d;
        color: #818181;
        box-shadow: inset 8px 0 4px -8px #000, inset -8px 0 4px -8px #000, inset 0 8px 4px -8px #000,
          inset 0 -6px 4px -8px #818181, inset 0 -8px 4px -8px #000, 0 0 4px 0 #000;
      }
    }
  }
`

const ViewFriendsFilled: React.FC<ViewFriendsProps> = (props) => {

    const {friends} = props    
    const { filtered, applyFilter, clearFilter } = useFilter(friends)
    const filterFriendsTooltip = "Enter text to filter friends by name"

    /// START PAGINATION STUFF

    const itemsPerPage = 20

    const [currentItems, setCurrentItems] = useState<LoadedFriend[]>([])
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

    function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>){
        const v = e.target.value
        if(v){
            applyFilter(t => t.friend.name.toLocaleLowerCase().includes(v.toLocaleLowerCase()))
        } else{
            clearFilter()
        }
    }

    return <VStack maxW="100%" maxH="100%" h="100%" w="100%"
    spacing={{ base: '10px', sm: '20px', md: '50px' }}>
        <ViewFriendsHeading/>
        <VStack w="100%" p = {{ base: 2, sm: 4, md: 8 }}>
            <HStack w="100%">
                <HStack w="50%">
                    <StyledPaginationWrapper size="small">
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
                    <Spacer/>
                </HStack>
                <label>Filter: </label>
                <Tooltip label={filterFriendsTooltip} placement="top" openDelay={1500}>
                    <Input onChange={handleFilterChange} w="100"/>
                </Tooltip>
                <Spacer/>
            </HStack>
            <ViewFriendsPanel {...{displayFriends: currentItems}}/>
        </VStack>
   </VStack>
}

type ViewFriendsPanelProps = {
    displayFriends: LoadedFriend[]
}

const ViewFriendsPanel: React.FC<ViewFriendsPanelProps> = ({displayFriends}) => {
    const panelBg = useColorModeValue('gray.50', 'whiteAlpha.100')

    return <Flex w="100%" h="100%" justifyContent="flex-start" gap={{ base: 1, sm: 2, md: 3 }}
        bg={panelBg} p={{ base: 1, sm: 3, md: 5 }} borderRadius="lg" wrap="wrap"
        align="flex-start">
        {displayFriends.map(f => <FriendCard loadedFriend={f}/>)}
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

export type FriendCardProps = {
    loadedFriend: LoadedFriend
}

const FriendCard: React.FC<FriendCardProps> = ({loadedFriend}) => {
    
    const expandLabel = "Expand friend to see details"
    const cardBg = useColorModeValue('gray.300', 'gray.700')
    const { isOpen, onOpen, onClose } = useDisclosure()

    return <VStack boxShadow="lg" maxW="400px"
        bg={cardBg} borderRadius="lg">
        <Text as="u" m={3} p={2} wordBreak="break-all" bg="inherit" fontWeight={600}
            textUnderlineOffset={5}>
            {loadedFriend.friend.name}
        </Text>
        <Box display={isOpen ? "none" : "inherit"} w="100%">
            <IconButton aria-label={expandLabel} w="100%"
                borderTopLeftRadius="none" borderTopRightRadius="none" onClick={onOpen}>
                <Icon as={MdExpandMore}/>
            </IconButton>
        </Box>
        <VStack display={isOpen ? "inherit" : "none"} w="100%">
            <CardContent {...{loadedFriend}}/>
            <IconButton aria-label={expandLabel} w="100%"
                borderTopLeftRadius="none" borderTopRightRadius="none" onClick={onClose}>
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

