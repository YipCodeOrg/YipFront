import { Center, Flex, Heading, HStack, Icon, Input, Tooltip, VStack } from "@chakra-ui/react"
import { LoadedFriend } from "./friends"
import { FaUserFriends } from "react-icons/fa"
import { useFilter } from "../../../../app/hooks"
import React from "react"

export type ViewFriendsProps = {
    friends: LoadedFriend[]
}

export const ViewFriends: React.FC<ViewFriendsProps> = ({friends}) => {

    const filterFriendsTooltip = "Enter text to filter friends by name"
    const { filtered, applyFilter, clearFilter } = useFilter(friends)

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
    <Center>
        <Heading
            fontWeight={600}
            fontSize={{ base: 'l', sm: '2xl', md: '3xl' }}
            lineHeight={'110%'}>
            {`Friends `}
            <Icon as={FaUserFriends}/>
        </Heading>
    </Center>
    <VStack w="100%" p = {{ base: 2, sm: 4, md: 8 }}>
        <HStack>
            <label>Filter: </label>
            <Tooltip label={filterFriendsTooltip} placement="top" openDelay={1500}>
                <Input onChange={handleFilterChange}/>
            </Tooltip>
        </HStack>
        <Flex w="100%" justifyContent="flex-start">
            {filtered.map(f => JSON.stringify(f))}
        </Flex>
    </VStack>
   </VStack>
}