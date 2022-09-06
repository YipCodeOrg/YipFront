import { Center, Heading, Icon, VStack } from "@chakra-ui/react"
import { IconType } from "react-icons"

export type PageWithHeadingProps = {
    children: JSX.Element,
    heading: string,
    icon?: IconType
}

export function PageWithHeading({children, heading, icon}: PageWithHeadingProps){
    return <VStack maxW="100%" maxH="100%" h="100%" w="100%"
        spacing={{ base: '10px', sm: '20px', md: '50px' }}>
        <Center>
            <Heading
                fontWeight={600}
                fontSize={{ base: 'l', sm: '2xl', md: '3xl' }}
                lineHeight={'110%'}>
                {heading}
                {icon !== undefined ? <Icon as={icon}/> : <></>}
            </Heading>
        </Center>
        {children}
    </VStack>
}