import { ButtonGroup, useColorModeValue } from "@chakra-ui/react"
import { ConfirmationPopoverButton } from "../../../../../../components/core/ConfirmationPopoverButton"
import { MdError } from "react-icons/md"
import { CreateAddressData } from "../../../../../../packages/YipStackLib/types/address/address"
import { CreateAddressSubmissionState } from "./CreateAddressSubmissionState"

export type CreateAddressFailedProps = {
    data: CreateAddressData | null,
    clearSubmissionState: () => void,
    retrySubmission: () => void
}

export function CreateAddressFailed(props: CreateAddressFailedProps) {

    const { data, clearSubmissionState, retrySubmission } = props
    
    const confirmButtonBg = useColorModeValue('gray.50', 'gray.900')
    const clearPopoverBodyMessage = "Do you want to clear the address data?"
    const retryPopoverBodyMessage = "Do you want to retry sending the address data?"

    function makeHeading(data: CreateAddressData){
        const name = data.name
        return name === undefined ? "Error Creating Adddress" : `Error Creating Adddress: ${name}  `
    }        

    return <CreateAddressSubmissionState {...{data, makeHeading, icon: MdError}}>
        <ButtonGroup>
            <ConfirmationPopoverButton action={clearSubmissionState} actionName="Clear"
                {...{confirmButtonBg, popoverBodyMessage: clearPopoverBodyMessage}}/>
            <ConfirmationPopoverButton action={retrySubmission} actionName="Retry"
                {...{confirmButtonBg, popoverBodyMessage: retryPopoverBodyMessage}}/>
        </ButtonGroup>
    </CreateAddressSubmissionState>
}