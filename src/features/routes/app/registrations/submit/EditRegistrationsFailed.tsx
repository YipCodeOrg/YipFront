import { ButtonGroup, useColorModeValue } from "@chakra-ui/react"
import { MdError } from "react-icons/md"
import { ConfirmationPopoverButton } from "../../../../../components/core/ConfirmationPopoverButton"
import { EditRegistrationsSubmissionState } from "./EditRegistrationsSubmissionState"

export type EditRegistrationsFailedProps = {
    yipCode: string | null,
    clearSubmissionState: () => void,
    retrySubmission: () => void
}

export function EditRegistrationsFailed(props: EditRegistrationsFailedProps){

    const { yipCode, clearSubmissionState, retrySubmission } = props
    
    const confirmButtonBg = useColorModeValue('gray.50', 'gray.900')
    const clearPopoverBodyMessage = "Do you want to clear the edit-registrations data that was submitted?"
    const retryPopoverBodyMessage = "Do you want to retry submitting the edit-registraitons data?"

    function makeHeading(yipCodeParam: string){
        return `Error Editing Registrations: ${yipCodeParam}  `
    }        

    return <EditRegistrationsSubmissionState {...{yipCode, makeHeading, icon: MdError}}>
        <ButtonGroup>
            <ConfirmationPopoverButton action={clearSubmissionState} actionName="Clear"
                {...{confirmButtonBg, popoverBodyMessage: clearPopoverBodyMessage}}/>
            <ConfirmationPopoverButton action={retrySubmission} actionName="Retry"
                {...{confirmButtonBg, popoverBodyMessage: retryPopoverBodyMessage}}/>
        </ButtonGroup>
    </EditRegistrationsSubmissionState>
}