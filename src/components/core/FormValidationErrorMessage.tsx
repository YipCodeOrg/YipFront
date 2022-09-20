import { FormErrorMessage } from "@chakra-ui/react"
import { EnhancedValidation } from "../../packages/YipStackLib/packages/YipAddress/validate/ehancedValidation"

export type FormValidationErrorMessageProps = {
    validation: EnhancedValidation | null
}

export function FormValidationErrorMessage(props: FormValidationErrorMessageProps){
    
    const { validation } = props
    
    if(validation !== null){
        return <FormErrorMessage>{ validation.errorMessages}</FormErrorMessage>
    }        
    return <></>
}



