import { Button, ButtonGroup, Center, Grid, GridItem, Heading, HStack,
    Icon, IconButton, Input, InputProps, VStack, useColorModeValue, Tooltip } from "@chakra-ui/react"
import { FaPlusCircle } from "react-icons/fa"
import { MdEditNote } from "react-icons/md"
import { ImBin } from "react-icons/im"
import { BiMoveVertical } from "react-icons/bi"
import { Registration } from "../../../../packages/YipStackLib/types/userAddressData"
import { useDrag, useDrop } from "react-dnd"
import { useCallback } from "react"

export type EditRegistrationsProps = {
    registrations: Registration[],
    setRegistrations: (newRegistrations: Registration[]) => void
    addressLabel: string
}

export const EditRegistrations: React.FC<EditRegistrationsProps> = ({registrations, addressLabel, setRegistrations}) => {
    
    const addNewRegistrationTooltip = "Add new registration"

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
            <Grid width="100%" gap={{ base: 1, sm: 2, md: 3 }} templateColumns='repeat(1, min-content) repeat(2, auto)'
                bg={useColorModeValue('gray.50', 'whiteAlpha.100')} p={{ base: 1, sm: 3, md: 5 }}
                borderRadius="lg">
                {registrations.map((r, i) => <EditRegistrationRow registrations={registrations}
                    index={i} key={r.name} setRegistrations={setRegistrations}/>)}
            </Grid>
        </VStack>
    </VStack>        
}

type EditRegistrationRowProps = {
    registrations: Registration[],
    index: number,
    setRegistrations: (newRegistrations: Registration[]) => void
}

const ItemTypes = {
    row: 'row'
}

const EditRegistrationRow: React.FC<EditRegistrationRowProps> = ({registrations, setRegistrations, index}) => {
    
    const registration = registrations[index]

    const handleRegistrationChange = (change: (r : Registration) => Registration) => 
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

    const handleMove = useCallback(function (from: number, to: number){
        //alert(JSON.stringify(registrations.map(r => r.name)))
        const moveElement = registrations.splice(from, 1)[0]        
        if(moveElement !== undefined){
            //alert(JSON.stringify(moveElement.name))
            registrations.splice(to, 0, moveElement)
            //alert(JSON.stringify(registrations.map(r => r.name)))
            setRegistrations([...registrations])
        }
        else{
            throw new Error("Problem getting registration at index");            
        }
    }, [registrations])    

    if(!registration){
        throw new Error("Problem getting registration from registrations list");        
    }

    const name = registration.name
    const hyperlink = registration.hyperlink
    const deleteButtonLabel = "Delete this registration"

    const handleInputRegistrationChange =
        (updater: (r: Registration, s: string) => Registration) =>
        (e : React.ChangeEvent<HTMLInputElement>) => {
            handleRegistrationChange(r => updater(r, e.target.value))
    }

    function removeRegistration(){
        setRegistrations(registrations.filter((_, i) => i != index))
    }
    
    const [{isDragging}, drag] = useDrag({
        type: ItemTypes.row,
        collect: monitor => ({
          isDragging: !!monitor.isDragging()
        }),
        item: {dragIndex: index}
      })
  
      const [{ isOver }, drop] = useDrop(() => ({
          accept: ItemTypes.row,
          drop: ({dragIndex}: DragItem) => handleMove(dragIndex, index),
          collect: monitor => ({
            isOver: !!monitor.isOver(),
          }),
    }), [handleMove])

    const standardInputBg = useColorModeValue('gray.100', 'gray.900')
    const inputBg = isOver! ? 'cyan.400' : standardInputBg

    //Non-MVP: Add FormControls here & use them to display validation errors around invalid entries?
    return <div style={{display: "contents", opacity: isDragging ? 0.5 : 1}} ref={drop}>
        <GridItem>
            <ButtonGroup variant="ghost" isAttached>
                <IconButton aria-label={"Move registration up or down"}
                    icon={<Icon as={BiMoveVertical}/>} ref={drag}/>
                <Tooltip label={deleteButtonLabel} placement="top" openDelay={1500}>
                    <IconButton aria-label={deleteButtonLabel}
                        icon={<Icon as={ImBin}/>} onClick={removeRegistration}/>
                </Tooltip>
            </ButtonGroup>
        </GridItem>
        <NameCell {...{name, handleInputRegistrationChange}} bg={inputBg}/>
        <GridItem bg={inputBg} borderRadius="lg">
            <HyperLinkCell {...{hyperlink: hyperlink ?? "", handleInputRegistrationChange}}/>
        </GridItem>
    </div>
}

type GridCellProps = {
    handleInputRegistrationChange: (updater: (r: Registration, s: string) => Registration)
        => (e: React.ChangeEvent<HTMLInputElement>) => void
}

type NameCellProps = {
    name: string,
    bg: string
} & GridCellProps

type DragItem = {
    dragIndex: number
}

const NameCell: React.FC<NameCellProps> = ({name, handleInputRegistrationChange, bg}) => {

    const props: InputProps = {
        value: name,
        onChange: handleInputRegistrationChange((r, s) => {return {...r, name: s}})
    }
    if(!name){
        props.placeholder="Add name"
    }
    return <GridItem bg={bg} borderRadius="lg">
            <Input {...props}/>
    </GridItem>
}


type HyperLinkCellProps = {
    hyperlink: string
} & GridCellProps

const HyperLinkCell: React.FC<HyperLinkCellProps> = ({hyperlink, handleInputRegistrationChange}) => {
    const props: InputProps = {
        value: hyperlink,
        onChange: handleInputRegistrationChange((r, s) => {return {...r, hyperlink: s}})
    }
    if(!hyperlink){
        props.placeholder="Add optional hyperlink"
    }
    return <Input {...props}/>
}