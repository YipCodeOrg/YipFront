import { VStack, Text, useColorModeValue, HStack, StackProps } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { PageWithHeading } from "../../../../../components/hoc/PageWithHeading"

export type EditRegistrationsSubmissionStateProps = {
    yipCode: string | null,
    makeHeading: (yipCode: string) => string,
    icon: IconType,
    children?: React.ReactNode
}

export function EditRegistrationsSubmissionState(props: EditRegistrationsSubmissionStateProps) {

    const { yipCode, makeHeading, icon, children } = props

    if(yipCode === null){
        return <EditRegistrationsSubmissionStateNullData/>
    }

    const heading = makeHeading(yipCode)

    return <PageWithHeading {...{heading}} icon={icon}>
        <RegistrationsPanel {...{yipCode}}/>
        {children}
    </PageWithHeading>
}

type RegistrationsPanelProps = {
    yipCode: string
} & StackProps

function RegistrationsPanel(props: RegistrationsPanelProps){

    const panelBg = useColorModeValue('gray.50', 'whiteAlpha.100')
    const { yipCode, ...rest } = props

    return <VStack align="left" justify="top" maxW="100%" bg={panelBg} borderRadius="lg" p={4} {...rest}>
        <VStack align="left">
                <LabelText text="YipCode"/>
                <HStack align="flex-start">
                    <Text boxShadow='outline' borderRadius="lg" p={2}>
                        {yipCode}
                    </Text>
                </HStack>
            </VStack>
    </VStack>
}

type LabelTextProps = {
    text: string
}

function LabelText({text}: LabelTextProps){
    
    const color = useColorModeValue('gray.600', 'gray.400')

    return <Text color={color}>
        {text}
    </Text>
}

function EditRegistrationsSubmissionStateNullData(){
    return <>ERROR: Could not get submitted data</>
}