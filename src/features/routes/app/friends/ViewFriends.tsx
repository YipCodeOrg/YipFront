import { Button, Center, Flex, Heading, HStack, Icon, Input, Stack, Tooltip, VStack, useColorModeValue, Text } from "@chakra-ui/react"
import { LoadedFriend } from "./friends"
import { FaUserFriends } from "react-icons/fa"
import { useFilter } from "../../../../app/hooks"
import React from "react"
import { Link as RouterLink } from "react-router-dom"

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

const ViewFriendsFilled: React.FC<ViewFriendsProps> = ({friends}) => {

    const filterFriendsTooltip = "Enter text to filter friends by name"
    const { filtered, applyFilter, clearFilter } = useFilter(friends)
    const panelBg = useColorModeValue('gray.50', 'whiteAlpha.100')

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
            <HStack>
                <label>Filter: </label>
                <Tooltip label={filterFriendsTooltip} placement="top" openDelay={1500}>
                    <Input onChange={handleFilterChange}/>
                </Tooltip>
            </HStack>
            <Flex w="100%" justifyContent="flex-start" gap={{ base: 1, sm: 2, md: 3 }}
                bg={panelBg} p={{ base: 1, sm: 3, md: 5 }} borderRadius="lg" wrap="wrap">
                {filtered.map(f => <FriendCard friend={f}/>)}
            </Flex>
        </VStack>
   </VStack>
}

export type FriendCardProps = {
    friend: LoadedFriend
}

const FriendCard: React.FC<FriendCardProps> = ({friend}) => {
    return <HStack boxShadow="lg"  maxW="400px"
    bg={useColorModeValue('gray.200', 'gray.700')} borderRadius="lg">
        <Text p="4" wordBreak="break-all">
            {friend.friend.name}
        </Text>        
    </HStack>
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