import { Button, useColorModeValue } from "@chakra-ui/react"
import { ConfirmationPopoverButton } from "./ConfirmationPopoverButton"

type CancelButtonProps = {
    shouldWarn: boolean,
    warningMessage?: string,
    cancelAction: () => void
}

export function CancelButton(props: CancelButtonProps){
    
    const { shouldWarn, warningMessage, cancelAction } = props

    if(shouldWarn){
        return <CancelButtonWithWarn {...{warningMessage, cancelAction}}/>
    } else {
        return <CancelButtonNoWarn {...{cancelAction}}/>
    }
}

type CancelButtonWithWarnProps = {
    warningMessage?: string | undefined,
    cancelAction: () => void
}

function CancelButtonWithWarn({warningMessage, cancelAction}: CancelButtonWithWarnProps){
    
    const popoverBodyMessage = warningMessage ?? "You may have unsaved changes. Are you sure you want to cancel?"
    const confirmButtonBg = useColorModeValue('gray.50', 'gray.900')

    return <ConfirmationPopoverButton {...{popoverBodyMessage, confirmButtonBg, action: cancelAction, actionName: "Cancel"}}/>
}

type CancelButtonNoWarnProps = {
    cancelAction: () => void
}

function CancelButtonNoWarn({cancelAction}: CancelButtonNoWarnProps){
    return <Button onClick={cancelAction}>
        Cancel
    </Button>
}