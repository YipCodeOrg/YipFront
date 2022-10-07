import { VStack, Text, useColorModeValue, HStack, StackProps } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { PageWithHeading } from "../../../../../../components/hoc/PageWithHeading"
import { Friend } from "../../../../../../packages/YipStackLib/types/friends/friend"

export type AddFriendSubmissionStateProps = {
    friend: Friend | null,
    makeHeading: (d: Friend) => string,
    icon: IconType,
    children?: React.ReactNode
}

export function AddFriendSubmissionState(props: AddFriendSubmissionStateProps) {

    const { friend, makeHeading, icon, children } = props

    if(friend === null){
        return <AddFriendSubmissionStateNullData/>
    }

    const heading = makeHeading(friend)

    return <PageWithHeading {...{heading}} icon={icon}>
        <FriendPanel {...{friend}}/>
        {children}
    </PageWithHeading>
}

type FriendPanelProps = {
    friend: Friend
} & StackProps

function FriendPanel(props: FriendPanelProps){

    const panelBg = useColorModeValue('gray.50', 'whiteAlpha.100')
    const { friend, ...rest } = props
    const { name, yipCode } = friend

    return <VStack align="left" justify="top" maxW="100%" bg={panelBg} borderRadius="lg" p={4} {...rest}>
        <VStack align="left">
                <LabelText text="Name"/>
                <HStack align="flex-start">
                    <Text boxShadow='outline' borderRadius="lg" p={2}>
                        {name}
                    </Text>
                </HStack>
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

function AddFriendSubmissionStateNullData(){
    return <>ERROR: Could not get submitted data</>
}