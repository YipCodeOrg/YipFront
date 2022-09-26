import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Tooltip, useColorModeValue, useDisclosure, UseDisclosureReturn, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { hasErrors, hasWarnings, printMessages, ValidationResult, ValidationSeverity } from "../../packages/YipStackLib/packages/YipAddress/validate/validation"
import { ValidationComponentProps, ValidationControl } from "../hoc/ValidationControl"

export type ValidateSubmitButtonProps = {
    tooltipLabel: string,
    text: string,
    validation: ValidationResult | null,
    revalidate: () => ValidationResult,
    submitChanges: () => void
}

export function ValidateSubmitButton(props: ValidateSubmitButtonProps) {

    const { text, validation, tooltipLabel, submitChanges, revalidate } = props

    const hasValidationErrors = hasErrors(validation)

    const validationErrorMessage = hasValidationErrors ?
        printMessages(validation, ValidationSeverity.ERROR) : ""

    function render({ isInvalid }: ValidationComponentProps) {
        return <ValidateSubmitButtonInner {...{
            tooltipLabel, actionName: text, submitChanges,
            validation, isInvalid, revalidate
        }} />
    }

    return <ValidationControl {...{ render, validationErrorMessage }} isInvalid={hasValidationErrors} />
}

type ValidateSubmitButtonInnerProps = {
    tooltipLabel: string,
    actionName: string,
    isInvalid: boolean,
    validation: ValidationResult | null,
    revalidate: () => ValidationResult,
    submitChanges: () => void
}

function ValidateSubmitButtonInner(props: ValidateSubmitButtonInnerProps) {

    const { actionName, isInvalid, tooltipLabel, submitChanges, validation, revalidate } = props
    const disclosure: UseDisclosureReturn = useDisclosure()
    const { isOpen, onOpen, onClose } = disclosure
    const confirmButtonBg = useColorModeValue('gray.50', 'gray.900')
    const [warningMessages, setWarningMessages] = useState<string>("")

    function submitValidationAction() {
        if (isInvalid) {
            throw new Error("Submit unexpectedly called with invalid data");
        }
        const effectiveValidation = validation ?? revalidate()
        const valHasErrors = hasErrors(effectiveValidation)
        if (!valHasErrors) {
            const valHasWarnings = hasWarnings(effectiveValidation)
            if (valHasWarnings) {
                setWarningMessages(printMessages(effectiveValidation, ValidationSeverity.WARNING))
                onOpen()
            } else {
                submitChanges()
            }
        }
    }

    function confirmAction() {
        onClose()
        submitChanges()
    }

    const confirmationBodyText = `Are you sure you want to ${actionName}? The following validation warnings were found: ${warningMessages}`
    const confirmationButtonText = `Yes, I want to ${actionName}`

    return <Popover isOpen={isOpen}>
        <PopoverTrigger>
            <Flex w={0} h={0} p={0} m={0} />
        </PopoverTrigger>
        <Tooltip placement='bottom' label={tooltipLabel} openDelay={1500} shouldWrapChildren>
            <Button isDisabled={isInvalid} onClick={submitValidationAction}>{actionName}</Button>
        </Tooltip>
        <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton onClick={onClose} />
            <PopoverHeader fontWeight={600}>{`Confirm ${actionName}`}</PopoverHeader>
            <PopoverBody>
                {confirmationBodyText}
            </PopoverBody>
            <VStack p={4}>
                <Button bg={confirmButtonBg} onClick={confirmAction}>{confirmationButtonText}</Button>
            </VStack>
        </PopoverContent>
    </Popover>
}