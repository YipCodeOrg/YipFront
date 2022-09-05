import { Button, ButtonGroup, FormControl, FormLabel, HStack, Input, useColorModeValue, VStack } from "@chakra-ui/react"
import { Friend, FriendsValidationResult } from "../../../../packages/YipStackLib/types/friends"

export type AddFriendProps = {
    friends: Friend[],
    newFriend: Friend,
    setNewFriend: (newFriend: Friend) => void,
    friendsValidation: FriendsValidationResult | null,
    saveFriends: () => void
}

export default function AddFriend(props: AddFriendProps){

    const { saveFriends, friendsValidation: validation, newFriend, setNewFriend } = props
    const { name: newName, yipCode: newYipCode } = newFriend    

    const buttonGroupBg = useColorModeValue('gray.50', 'gray.900')

    const handleInputRegistrationChange =
    (updater: (f: Friend, s: string) => Friend) =>
    (e : React.ChangeEvent<HTMLInputElement>) => {
        setNewFriend(updater(newFriend, e.target.value))
    }

    const handleNameInputChange = handleInputRegistrationChange((f, s) => {return {...f, name: s}})
    const handleYipCodeInputChange = handleInputRegistrationChange((f, s) => {return {...f, yipCode: s}})

    let isNameInvalid = false

    return <VStack>
        <HStack>
            <FormControl isRequired isInvalid={isNameInvalid}>
                <FormLabel>Name</FormLabel>
                <Input value={newName} onChange={handleNameInputChange}/>
            </FormControl>
        </HStack>
        <ButtonGroup isAttached variant='outline'
            bg={buttonGroupBg} borderRadius="lg">                
            <Button onClick={saveFriends}>Save</Button>
        </ButtonGroup>
    </VStack>

}