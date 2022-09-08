import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, useColorModeValue, VStack } from "@chakra-ui/react"

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

    return <Popover>
        <PopoverTrigger>
            <Button>Cancel</Button>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader fontWeight={600}>Confirm Cancel</PopoverHeader>
            <PopoverBody>
                {popoverBodyMessage}
            </PopoverBody>
            <VStack p={4}>
                <Button bg={confirmButtonBg} onClick={cancelAction}>Yes, I want to cancel</Button>
            </VStack>    
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