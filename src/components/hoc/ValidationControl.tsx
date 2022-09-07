import { Flex, useColorModeValue } from "@chakra-ui/react"
import { InfoButton } from "../core/InfoButton"

export type ValidationComponentProps = {
    isInvalid: boolean,
}

export type ValidationControlProps = {
    message?: string,
    render: (p: ValidationComponentProps) => JSX.Element
} & ValidationComponentProps

export function ValidationControl(props: ValidationControlProps){

    const { isInvalid, render, message } = props

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