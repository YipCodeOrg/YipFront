import { Button, ButtonProps, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
    PopoverContent, PopoverHeader, PopoverTrigger, VStack } from "@chakra-ui/react"

export type ConfirmationPopoverButtonProps = {
    action: () => void,
    actionName: string,
    popoverBodyMessage: string,
    confirmButtonBg: string,
    buttonLabel?: string
} & ButtonProps

export function ConfirmationPopoverButton(props: ConfirmationPopoverButtonProps){

    const { action, actionName, popoverBodyMessage, 
        confirmButtonBg, buttonLabel, ...rest } = props

    const effectiveButtonLabel = buttonLabel ?? actionName

    return <Popover>
        <PopoverTrigger>
            <Button {...rest}>{effectiveButtonLabel}</Button>
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