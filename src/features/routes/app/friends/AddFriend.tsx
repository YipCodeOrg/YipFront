import { Button, ButtonGroup, FormControl, FormLabel, HStack, Input, useColorModeValue, VStack } from "@chakra-ui/react"
import { BsPersonPlusFill } from "react-icons/bs"
import { FormValidationErrorMessage } from "../../../../components/core/FormValidationErrorMessage"
import { PageWithHeading } from "../../../../components/hoc/PageWithHeading"
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

    const buttonGroupBg = useColorModeValue('gray.50', 'gray.900')

    let nameValidationResult: ValidationResult | null = null
    let yipCodeValidationResult: ValidationResult | null = null

    const handleInputRegistrationChange =
    (updater: (f: Friend, s: string) => Friend) =>
    (e : React.ChangeEvent<HTMLInputElement>) => {
        setNewFriend(updater(newFriend, e.target.value))
    }

    if(friendsValidation !== null){
        const index = friendsValidation.index
        const validation = friendsValidation.obj
        const itemValidation = validation.itemValidations[index]
        if(itemValidation !== undefined){
            nameValidationResult = itemValidation.fieldValidations.name
            yipCodeValidationResult = itemValidation.fieldValidations.yipCode
        }
    }    

    return <PageWithHeading heading="Add Friend " icon={BsPersonPlusFill}>        
        <VStack w="100%" p = {{ base: 2, sm: 4, md: 8 }}>
            <HStack align="flex-start" display={{base: "none", md: "inherit"}}>
                <FormContent {...{nameValidationResult, yipCodeValidationResult, newFriend, handleInputRegistrationChange}} />
            </HStack>
            <VStack align="flex-start" display={{base: "inherit", md: "none"}}>
                <FormContent {...{nameValidationResult, yipCodeValidationResult, newFriend, handleInputRegistrationChange}} />
            </VStack>
            <ButtonGroup isAttached variant='outline'
                bg={buttonGroupBg} borderRadius="lg">
                <Button onClick={saveFriends}>Save</Button>
            </ButtonGroup>
        </VStack>
    </PageWithHeading>

}

type FormContentProps = {
    nameValidationResult: ValidationResult | null,
    yipCodeValidationResult: ValidationResult | null,
    newFriend: Friend,
    handleInputRegistrationChange: (updater: (f: Friend, s: string) => Friend) =>
        (e : React.ChangeEvent<HTMLInputElement>) => void
}

function FormContent({nameValidationResult, yipCodeValidationResult,
    newFriend, handleInputRegistrationChange}: FormContentProps){

    const isNameInvalid = hasErrors(nameValidationResult)
    const isYipCodeInvalid = hasErrors(yipCodeValidationResult)
    const { name: newName, yipCode: newYipCode } = newFriend

    const handleNameInputChange = handleInputRegistrationChange((f, s) => {return {...f, name: s}})
    const handleYipCodeInputChange = handleInputRegistrationChange((f, s) => {return {...f, yipCode: s}})

    return <>
            <FormControl isRequired isInvalid={isNameInvalid}>
                <FormLabel>Name</FormLabel>
                <Input value={newName} onChange={handleNameInputChange}/>
                <FormValidationErrorMessage validation={nameValidationResult}/>
            </FormControl>
            <FormControl isRequired isInvalid={isYipCodeInvalid}>
                <FormLabel>YipCode</FormLabel>
                <Input value={newYipCode} onChange={handleYipCodeInputChange}/>
                <FormValidationErrorMessage validation={yipCodeValidationResult}/>
            </FormControl>
    </>
}