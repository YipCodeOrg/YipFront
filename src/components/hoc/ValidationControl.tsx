import { Flex, useColorModeValue } from "@chakra-ui/react"
import { ArrayValidationResult, hasErrors, printMessages, ValidationResult, ValidationSeverity } from "../../packages/YipStackLib/packages/YipAddress/validate/validation"
import { InfoButton } from "../core/InfoButton"

export type ValidationComponentProps = {
    isInvalid: boolean,
}

export type ValidationControlProps = {
    validationErrorMessage?: string,
    render: (p: ValidationComponentProps) => JSX.Element
} & ValidationComponentProps

export function ValidationControl(props: ValidationControlProps){

    const { isInvalid, render, validationErrorMessage: message } = props

    if(!isInvalid){
        return render({isInvalid})
    } else{

        const infoMessage = message?? "There were validation errors"
        const errorColor = useColorModeValue("red.400", "red.300")

        return <Flex>
                <InfoButton {...{infoMessage}} iconColor={errorColor}/>        
                <Flex borderColor={errorColor} borderStyle="solid" borderWidth="initial" borderRadius="lg">                
                    {render({isInvalid})}
                </Flex>        
            </Flex>
    }    
}

export type ValidationControlData = {
    validationErrorMessage: string,
    isInvalid: boolean,
}

export function standardValidationControlDataFromArray<TItemValid>(validation: ArrayValidationResult<TItemValid> | null): ValidationControlData{
    return(standardValidationControlData(validation?.topValidationResult ?? null))
}

export function standardValidationControlData(validation: ValidationResult | null){
    let validationErrorMessage = ""
    let isInvalid = false 
    
    if(validation !== null && hasErrors(validation)){
        validationErrorMessage = `Validation errors must be fixed before saving. Errors found: ${printMessages(validation, ValidationSeverity.ERROR)}`
        isInvalid = hasErrors(validation)
    }

    return { validationErrorMessage, isInvalid }
}