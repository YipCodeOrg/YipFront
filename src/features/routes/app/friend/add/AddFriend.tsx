import { Button, ButtonGroup, FormControl, FormLabel, HStack, Input, useColorModeValue, VStack } from "@chakra-ui/react"
import { useCallback, useMemo } from "react"
import { BsPersonPlusFill } from "react-icons/bs"
import { useEnhancedValidation, useValidation } from "../../../../../app/hooks"
import { FormValidationErrorMessage } from "../../../../../components/core/FormValidationErrorMessage"
import { LogoLoadStateWrapper } from "../../../../../components/hoc/LoadStateWrapper"
import { PageWithHeading } from "../../../../../components/hoc/PageWithHeading"
import { standardValidationControlDataFromArray, ValidationControl } from "../../../../../components/hoc/ValidationControl"
import { hasErrors, ValidationResult } from "../../../../../packages/YipStackLib/packages/YipAddress/validate/validation"
import { Friend } from "../../../../../packages/YipStackLib/types/friends/friend"
import { FriendsValidationResult, validateFriends } from "../../../../../packages/YipStackLib/types/friends/validateFriend"
import { useFriendsHubFetch } from "../../friends/friendsHooks"
import { FetchFriendsThunk, LoadedFriend } from "../../friends/friendsSlice"
import { useAddFriendEdit } from "./edit/addFriendEditHooks"
import { useAddFriendHubSubmit } from "./submit/addFriendSubmissionHooks"
import { AddFriendSubmissionThunk } from "./submit/addFriendSubmissionSlice"

export type ConnectedAddFriendProps = {
    submissionThunk: AddFriendSubmissionThunk,
    fetchThunk: FetchFriendsThunk    
}

export function ConnectedAddFriend(props: ConnectedAddFriendProps){
    const { submissionThunk, fetchThunk } = props

    const { sliceData, loadStatus } = useFriendsHubFetch(fetchThunk)
    const { friend: newFriend, setFriend: setNewFriend } = useAddFriendEdit()

    const { newFriendIndex, friends } = useMemo(() => combineNewFriendWithFriends(newFriend, sliceData), [newFriend, sliceData])
    
    const { validation, updateValidation: revalidate } = useValidation(() => friends,
        validateFriends, v => v.topValidationResult, [friends])

    const submitHook = useAddFriendHubSubmit(submissionThunk)    

    const saveFriends = useCallback(function(){
        submitHook(newFriend)
    }, [submitHook, newFriend])

    const friendsValidation: NewFriendValidationResult | null = useMemo(function(){
        if(validation === null){
            return null
        }
        return {
            newFriendIndex,
            result: validation
        }
    }, [validation, newFriendIndex])

    return <LogoLoadStateWrapper status={loadStatus} loadedElement={<AddFriend
        {...{friends, newFriend, setNewFriend, friendsValidation,
                saveFriends, revalidate}}
    />} logoSize={80}/>
}

type FriendCombinationData = {
    newFriendIndex: number,
    friends: Friend[]
}

function combineNewFriendWithFriends(newFriend: Friend, sliceData: LoadedFriend[] | undefined) : FriendCombinationData{
    const sliceFriends = sliceData?.map(l => l.friend) ?? []
    const friends = [newFriend, ...sliceFriends]
    const newFriendIndex = 0
    return {
        newFriendIndex,
        friends
    }
}

export type NewFriendValidationResult  = {
    result: FriendsValidationResult,
    newFriendIndex: number
}

export type AddFriendProps = {
    friends: Friend[],
    newFriend: Friend,
    setNewFriend: (newFriend: Friend) => void,
    friendsValidation: NewFriendValidationResult | null,
    saveFriends: () => void,
    revalidate: () => void
}

export function AddFriend(props: AddFriendProps){

    const { saveFriends, friendsValidation, newFriend, setNewFriend } = props

    let nameValidationResult: ValidationResult | null = null
    let yipCodeValidationResult: ValidationResult | null = null

    const handleInputRegistrationChange =
    (updater: (f: Friend, s: string) => Friend) =>
    (e : React.ChangeEvent<HTMLInputElement>) => {
        setNewFriend(updater(newFriend, e.target.value))
    }

    if(friendsValidation !== null){
        const index = friendsValidation.newFriendIndex
        const validation = friendsValidation.result
        const itemValidation = validation.itemValidations[index]
        if(itemValidation !== undefined){
            nameValidationResult = itemValidation.fieldValidations.name
            yipCodeValidationResult = itemValidation.fieldValidations.yipCode
        }
    }

    const { validationErrorMessage, isInvalid } = standardValidationControlDataFromArray(friendsValidation?.result ?? null)

    function renderButtonGroup(){
        return <AddFriendButtonGroup {...{saveFriends, isInvalid}}/>
    }

    return <PageWithHeading heading="Add Friend " icon={BsPersonPlusFill}>        
        <VStack w="100%" p = {{ base: 2, sm: 4, md: 8 }}>
            <HStack align="flex-start" display={{base: "none", md: "inherit"}}>
                <FormContent {...{nameValidationResult, yipCodeValidationResult, newFriend, handleInputRegistrationChange}} />
            </HStack>
            <VStack align="flex-start" display={{base: "inherit", md: "none"}}>
                <FormContent {...{nameValidationResult, yipCodeValidationResult, newFriend, handleInputRegistrationChange}} />
            </VStack>
            <ValidationControl render={renderButtonGroup} {...{isInvalid, validationErrorMessage}}/>
        </VStack>
    </PageWithHeading>

}

export type AddFriendButtonGroupProps = {
    saveFriends: () => void,
    isInvalid: boolean
}

function AddFriendButtonGroup({saveFriends, isInvalid}: AddFriendButtonGroupProps){

    const buttonGroupBg = useColorModeValue('gray.50', 'gray.900')

    return <ButtonGroup isAttached variant='outline'
        bg={buttonGroupBg} borderRadius="lg">
        <Button onClick={saveFriends} isDisabled={isInvalid}>Save</Button>
    </ButtonGroup>
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
    const enhancedNameValidation = useEnhancedValidation(nameValidationResult)
    const enhancedYipCodeValidation = useEnhancedValidation(yipCodeValidationResult)

    return <>
            <FormControl isRequired isInvalid={isNameInvalid}>
                <FormLabel>Name</FormLabel>
                <Input value={newName} onChange={handleNameInputChange}/>
                <FormValidationErrorMessage validation={enhancedNameValidation}/>
            </FormControl>
            <FormControl isRequired isInvalid={isYipCodeInvalid}>
                <FormLabel>YipCode</FormLabel>
                <Input value={newYipCode} onChange={handleYipCodeInputChange}/>
                <FormValidationErrorMessage validation={enhancedYipCodeValidation}/>
            </FormControl>
    </>
}