import { ButtonGroup, useColorModeValue } from "@chakra-ui/react"
import { MdError } from "react-icons/md"
import { ConfirmationPopoverButton } from "../../../../../../components/core/ConfirmationPopoverButton"
import { Friend } from "../../../../../../packages/YipStackLib/types/friends/friend"
import { AddFriendSubmissionState } from "./AddFriendSubmissionState"

export type AddFriendFailedProps = {
    friend: Friend | null,
    clearSubmissionState: () => void,
    retrySubmission: () => void
}

export function AddFriendFailed(props: AddFriendFailedProps) {

    const { friend, clearSubmissionState, retrySubmission } = props
    
    const confirmButtonBg = useColorModeValue('gray.50', 'gray.900')
    const clearPopoverBodyMessage = "Do you want to clear the friend data?"
    const retryPopoverBodyMessage = "Do you want to retry sending the friend data?"

    function makeHeading(friend: Friend){
        const name = friend.name
        return `Error Adding Friend: ${name}  `
    }        

    return <AddFriendSubmissionState {...{friend, makeHeading, icon: MdError}}>
        <ButtonGroup>
            <ConfirmationPopoverButton action={clearSubmissionState} actionName="Clear"
                {...{confirmButtonBg, popoverBodyMessage: clearPopoverBodyMessage}}/>
            <ConfirmationPopoverButton action={retrySubmission} actionName="Retry"
                {...{confirmButtonBg, popoverBodyMessage: retryPopoverBodyMessage}}/>
        </ButtonGroup>
    </AddFriendSubmissionState>
}