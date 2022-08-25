import { Button, ButtonGroup, Center, Grid, GridItem, Heading, HStack,
    Icon, IconButton, Input, InputProps, VStack, useColorModeValue, Tooltip } from "@chakra-ui/react"
import { FaPlusCircle } from "react-icons/fa"
import { MdEditNote } from "react-icons/md"
import { Registration } from "../../../../packages/YipStackLib/types/userAddressData"

export type EditRegistrationsProps = {
    registrations: Registration[],
    setRegistrations: (newRegistrations: Registration[]) => void
    addressLabel: string
}

export const EditRegistrations: React.FC<EditRegistrationsProps> = ({registrations, addressLabel, setRegistrations}) => {
    
    const addNewRegistrationTooltip = "Add new registration"

    const handleRegsitrationChange = (index: number) => 
        (change: (r : Registration) => Registration) => 
    {
        const registrationToChange = registrations[index]
        if(!!registrationToChange){
            const updatedRegistration = change(registrationToChange)
            const newRegistrations = [...registrations]
            newRegistrations[index] = updatedRegistration
            setRegistrations(newRegistrations)
        }
        else{
            throw new Error("Problem getting registration at index");            
        }
    }

    function addNewRegistration(){
        const addressLastUpdated = new Date()
        setRegistrations([{name: "", addressLastUpdated}, ...registrations])
    }

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
        <VStack w="100%" p = {{ base: 2, sm: 4, md: 8 }}>
            <HStack w="100%" justifyContent="flex-start">
                <ButtonGroup isAttached variant='outline'
                    bg={useColorModeValue('gray.50', 'gray.900')} borderRadius="lg">                
                    <Button>Save</Button>
                    <Tooltip label={addNewRegistrationTooltip} placement="top" openDelay={500}>
                        <IconButton aria-label={addNewRegistrationTooltip}
                            icon={<Icon as={FaPlusCircle}/>} onClick={addNewRegistration}/>
                    </Tooltip>
                </ButtonGroup>
            </HStack>
            <Grid width="100%" gap={{ base: 1, sm: 2, md: 3 }} templateColumns='repeat(2, 1fr)'
                bg={useColorModeValue('gray.50', 'whiteAlpha.100')} p={{ base: 1, sm: 3, md: 5 }}
                borderRadius="lg">
                {registrations.map((r, i) => <EditRegistrationRow registration={r}
                    key={i} handleRegistrationChange={handleRegsitrationChange(i)}/>)}
            </Grid>
        </VStack>
    </VStack>        
}

type EditRegistrationRowProps = {
    registration: Registration,
    handleRegistrationChange: (change: (r : Registration) => Registration) => void
}

const EditRegistrationRow: React.FC<EditRegistrationRowProps> = ({registration, handleRegistrationChange}) => {
    
    const name = registration.name
    const hyperlink = registration.hyperlink

    const handleInputRegistrationChange =
        (updater: (r: Registration, s: string) => Registration) =>
        (e : React.ChangeEvent<HTMLInputElement>) => {
            handleRegistrationChange(r => updater(r, e.target.value))
            e.target.focus()
    }
    //Non-MVP: Add FormControls here & use them to display validation errors around invalid entries?
    return <>
        <CustomGridItem>
            <Input value={name}
                onChange={handleInputRegistrationChange((r, s) => {return {...r, name: s}})}/>
        </CustomGridItem>
        <CustomGridItem>
            <HyperLinkCell {...{hyperlink, handleInputRegistrationChange}}/>
        </CustomGridItem>
    </>
}

type HyperLinkCellProps = {
    hyperlink: string | undefined,
    handleInputRegistrationChange: (updater: (r: Registration, s: string) => Registration)
        => (e: React.ChangeEvent<HTMLInputElement>) => void
}

const HyperLinkCell: React.FC<HyperLinkCellProps> = ({hyperlink, handleInputRegistrationChange}) => {
    const props: InputProps = {
        value: hyperlink,
        onChange: handleInputRegistrationChange((r, s) => {return {...r, hyperlink: s}})
    }
    if(hyperlink === undefined){
        props.placeholder="Add optional hyperlink"
    }
    return <Input {...props}/>
}


const CustomGridItem: React.FC<{children: JSX.Element}> = ({children}) => {
    return <GridItem bg={useColorModeValue('gray.100', 'gray.900')} borderRadius="lg">
        {children}
    </GridItem>
}