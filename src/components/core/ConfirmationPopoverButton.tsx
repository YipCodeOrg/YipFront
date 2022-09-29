import { Button, ButtonProps, Popover, PopoverArrow, PopoverBody, PopoverCloseButton,
    PopoverContent, PopoverHeader, PopoverTrigger, useDisclosure, VStack } from "@chakra-ui/react"
import { useCallback } from "react"

export type ConfirmationPopoverButtonProps = {
    action: () => void,
    actionName: string,
    popoverBodyMessage: string,
    confirmButtonBg: string,
    buttonLabel?: string
} & ButtonProps

export function ConfirmationPopoverButton(props: ConfirmationPopoverButtonProps){
    const { isOpen, onToggle, onClose } = useDisclosure()
    const { action, actionName, popoverBodyMessage, 
        confirmButtonBg, buttonLabel, ...rest } = props

    const closeAndRunAction = useCallback(function(){
        onClose()
        action()
    }, [onClose, action])

    const effectiveButtonLabel = buttonLabel ?? actionName

    return <Popover {...{isOpen}}>
        <PopoverTrigger>
            <Button onClick={onToggle} {...rest}>{effectiveButtonLabel}</Button>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton onClick={onClose}/>
            <PopoverHeader fontWeight={600}>{`Confirm ${actionName}`}</PopoverHeader>
            <PopoverBody>
                {popoverBodyMessage}
            </PopoverBody>
            <VStack p={4}>
                <Button bg={confirmButtonBg} onClick={closeAndRunAction}>{`Yes, I want to ${actionName}`}</Button>
            </VStack>    
        </PopoverContent>
    </Popover>

}