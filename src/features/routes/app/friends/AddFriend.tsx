import { Button, ButtonGroup, FormControl, FormLabel, HStack, Input, useColorModeValue, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { Friend, FriendsValidationResult } from "../../../../packages/YipStackLib/types/friends"

export type AddFriendProps = {
    friends: Friend[],
    validation: FriendsValidationResult | null,    
    saveFriends: () => void,
    setFriends: (newFriends: Friend[]) => void
}

export default function AddFriend(props: AddFriendProps){

    const { saveFriends } = props

    const [newName, setNewName] = useState<string>("")
    const [newYipCode, setNewYipCode] = useState<string>("")

    const buttonGroupBg = useColorModeValue('gray.50', 'gray.900')

    function handleNameChange(e : React.ChangeEvent<HTMLInputElement>){
        setNewName(e.target.value)
    }

    function handleYipCodeChange(e : React.ChangeEvent<HTMLInputElement>){
        setNewYipCode(e.target.value)
    }

    return <VStack>
        <HStack>
            <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input value={newName} onChange={handleNameChange}/>
            </FormControl>
        </HStack>
        <ButtonGroup isAttached variant='outline'
            bg={buttonGroupBg} borderRadius="lg">                
            <Button onClick={saveFriends}>Save</Button>
        </ButtonGroup>
    </VStack>

}