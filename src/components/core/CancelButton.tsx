import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from "@chakra-ui/react"

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
    
    const popoverBodyMessage = warningMessage ?? "Are you sure you want to cancel?"

    return <Popover>
        <PopoverTrigger>
            <Button onClick={cancelAction}>Cancel</Button>
        </PopoverTrigger>
        <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Confirm Cancel</PopoverHeader>
        <PopoverBody>{popoverBodyMessage}</PopoverBody>
        </PopoverContent>
    </Popover>
}

type CancelButtonNoWarnProps = {
    cancelAction: () => void
}

function CancelButtonNoWarn({cancelAction}: CancelButtonNoWarnProps){
    return <Button onClick={cancelAction}>
        Cancel
    </Button>
}