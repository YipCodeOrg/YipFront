import { Center, Heading, Icon, StackProps, VStack } from "@chakra-ui/react"
import { IconType } from "react-icons"

export type PageWithHeadingProps = {
    children?: React.ReactNode
    heading: string,
    icon?: IconType
} & StackProps

export function PageWithHeading({children, heading, icon, ...rest}: PageWithHeadingProps){
    return <VStack maxW="100%" maxH="100%" h="100%" w="100%"
        spacing={{ base: '10px', sm: '15px', md: '20px', lg: '40px' }} {...rest}>
        <Center>
            <Heading
                fontWeight={600}
                fontSize={{ base: 'l', sm: '2xl', md: '3xl', lg: '4xl' }}
                lineHeight={'110%'}>
                {heading}
                {icon !== undefined ? <Icon as={icon}/> : <></>}
            </Heading>
        </Center>
        {children}
    </VStack>
}