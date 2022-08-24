import { Center, Grid, GridItem, Heading, Icon, Input, InputProps, VStack } from "@chakra-ui/react"
import { MdEditNote } from "react-icons/md"
import { Registration } from "../../../../packages/YipStackLib/types/userAddressData"

export type EditRegistrationsProps = {
    registrations: Registration[],
    addressLabel: string
}

export const EditRegistrations: React.FC<EditRegistrationsProps> = ({registrations, addressLabel}) => {
    //TODO: Devise better solution for mobile screen e.g. a vertical list of items & a drawer on each
    return <VStack maxW="100%" maxH="100%" h="100%" w="100%"
         spacing={{ base: '10px', sm: '20px', md: '50px' }}>
        <Center>
            <Heading
                fontWeight={600}
                fontSize={{ base: 'l', sm: '2xl', md: '3xl' }}
                lineHeight={'110%'}>
                {`Edit Registrations (${addressLabel})  `}
                <Icon as={MdEditNote}/>
            </Heading>
        </Center>
        <Grid width="100%" p = {{ base: 2, sm: 4, md: 8 }}
        gap={{ base: 1, sm: 2, md: 3 }} templateColumns='repeat(2, 1fr)'>
            {registrations.map(r => <EditRegistrationRow registration={r}/>)}
        </Grid>
    </VStack>        
}

type EditRegistrationRowProps = {
    registration: Registration
}

const EditRegistrationRow: React.FC<EditRegistrationRowProps> = ({registration}) => {
    
    const name = registration.name
    const hyperlink = registration.hyperlink

    const HyperLinkCell = () => {
        const props: InputProps = {
            value: hyperlink
        }
        if(hyperlink === undefined){
            props.placeholder="Add optional hyperlink"
        }
        return <Input {...props}/>
    }

    //Non-MVP: Add FormControls here & use them to display validation errors around invalid entries?
    return <>
        <GridItem>
            <Input value={name}/>
        </GridItem>
        <GridItem>
            <HyperLinkCell/>
        </GridItem>
    </>
}