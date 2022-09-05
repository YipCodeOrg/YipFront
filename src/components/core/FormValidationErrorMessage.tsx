import { FormErrorMessage } from "@chakra-ui/react"
import { printMessages, ValidationResult, ValidationSeverity } from "../../packages/YipStackLib/packages/YipAddress/validate/validation"

export type FormValidationErrorMessageProps = {
    validation: ValidationResult | null
}

export function FormValidationErrorMessage(props: FormValidationErrorMessageProps){
    
    const { validation } = props
    
    if(validation !== null){
        return <FormErrorMessage>{ printMessages(validation, ValidationSeverity.ERROR)}</FormErrorMessage>
    }        
    return <></>
}



