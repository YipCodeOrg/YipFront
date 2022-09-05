import { Button, ButtonGroup, FormControl, FormLabel, HStack, Input, useColorModeValue, VStack } from "@chakra-ui/react"
import { FormValidationErrorMessage } from "../../../../components/core/FormValidationErrorMessage"
import { Indexed } from "../../../../packages/YipStackLib/packages/YipAddress/util/types"
import { hasErrors, ValidationResult } from "../../../../packages/YipStackLib/packages/YipAddress/validate/validation"
import { Friend, FriendsValidationResult } from "../../../../packages/YipStackLib/types/friends"

export type IndexedFriendsValidationResult = Indexed<FriendsValidationResult>

export type AddFriendProps = {
    friends: Friend[],
    newFriend: Friend,
    setNewFriend: (newFriend: Friend) => void,
    friendsValidation: IndexedFriendsValidationResult | null,
    saveFriends: () => void
}

export default function AddFriend(props: AddFriendProps){

    const { saveFriends, friendsValidation, newFriend, setNewFriend } = props
    const { name: newName, yipCode: newYipCode } = newFriend    

    const buttonGroupBg = useColorModeValue('gray.50', 'gray.900')

    const handleInputRegistrationChange =
    (updater: (f: Friend, s: string) => Friend) =>
    (e : React.ChangeEvent<HTMLInputElement>) => {
        setNewFriend(updater(newFriend, e.target.value))
    }

    const handleNameInputChange = handleInputRegistrationChange((f, s) => {return {...f, name: s}})
    const handleYipCodeInputChange = handleInputRegistrationChange((f, s) => {return {...f, yipCode: s}})

    let nameValidationResult: ValidationResult | null = null

    if(friendsValidation !== null){
        const index = friendsValidation.index
        const validation = friendsValidation.obj
        const itemValidation = validation.itemValidations[index]
        if(itemValidation !== undefined){
            nameValidationResult = itemValidation.name            
        }
    }

    const isNameInvalid = hasErrors(nameValidationResult)

    return <VStack>
        <HStack>
            <FormControl isRequired isInvalid={isNameInvalid}>
                <FormLabel>Name</FormLabel>
                <Input value={newName} onChange={handleNameInputChange}/>
                <FormValidationErrorMessage validation={nameValidationResult}/>
            </FormControl>
        </HStack>
        <ButtonGroup isAttached variant='outline'
            bg={buttonGroupBg} borderRadius="lg">
            <Button onClick={saveFriends}>Save</Button>
        </ButtonGroup>
    </VStack>

}