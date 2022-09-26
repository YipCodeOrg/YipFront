import { Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
    PopoverContent, PopoverHeader, PopoverTrigger, VStack } from "@chakra-ui/react"

export type ConfirmationPopoverButtonProps = {
    action: () => void,
    actionName: string,
    popoverBodyMessage: string,
    confirmButtonBg: string
}

export function ConfirmationPopoverButton(props: ConfirmationPopoverButtonProps){

    const { action, actionName, popoverBodyMessage, confirmButtonBg } = props

    return <Popover>
        <PopoverTrigger>
            <Button>{actionName}</Button>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader fontWeight={600}>{`Confirm ${actionName}`}</PopoverHeader>
            <PopoverBody>
                {popoverBodyMessage}
            </PopoverBody>
            <VStack p={4}>
                <Button bg={confirmButtonBg} onClick={action}>{`Yes, I want to ${actionName}`}</Button>
            </VStack>    
        </PopoverContent>
    </Popover>

}