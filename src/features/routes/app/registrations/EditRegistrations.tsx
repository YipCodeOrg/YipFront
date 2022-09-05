import { Button, ButtonGroup, Center, Grid, GridItem, Heading, HStack,
    Icon, IconButton, Input, InputProps, VStack, useColorModeValue, Tooltip, Link, FormControl, FormErrorMessage } from "@chakra-ui/react"
import { FaPlusCircle } from "react-icons/fa"
import { MdEditNote, MdUpdate } from "react-icons/md"
import { ImBin } from "react-icons/im"
import { BiMoveVertical } from "react-icons/bi"
import { useDrag, useDrop } from "react-dnd"
import { useCallback } from "react"
import AlphaSortButtons from "../../../../components/core/AlphaSortButtons"
import { BsFillArrowUpRightSquareFill } from "react-icons/bs"
import { AggregatedRegistrationUpdateStatusIcon, RegistrationUpdateStatusIcon } from "./RegistrationUpdateStatusIcon"
import { Registration, RegistrationsValidationResult, RegistrationValidationResult } from "../../../../packages/YipStackLib/types/registrations"
import { hasErrors, printMessages, ValidationResult, ValidationSeverity } from "../../../../packages/YipStackLib/packages/YipAddress/validate/validation"

export type EditRegistrationsProps = {
    registrations: Registration[],
    validation: RegistrationsValidationResult | null,
    saveRegistrations: () => void
    setRegistrations: (newRegistrations: Registration[]) => void
    addressLabel: string,
    addressLastUpdated: Date,
}

export const EditRegistrations: React.FC<EditRegistrationsProps> = ({registrations, addressLabel, setRegistrations, addressLastUpdated, validation,
saveRegistrations}) => {
    
    const addNewRegistrationTooltip = "Add new registration"

    function addNewRegistration(){
        const addressLastUpdated = new Date()
        setRegistrations([{name: "", addressLastUpdated}, ...registrations])
    }

    function getRegsitrationValidation(i: number) : RegistrationValidationResult | null{
        if(validation === null){
            return null
        }
        const result = validation.itemValidations[i]
        if(result === undefined){
            throw new Error(`Index out of bounds: ${i}`)           
        }
        return result
    }

    const buttonGroupBg = useColorModeValue('gray.50', 'gray.900')

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
                    bg={buttonGroupBg} borderRadius="lg">                
                    <Button onClick={saveRegistrations}>Save</Button>
                    <Tooltip label={addNewRegistrationTooltip} placement="top" openDelay={500}>
                        <IconButton aria-label={addNewRegistrationTooltip}
                            icon={<Icon as={FaPlusCircle}/>} onClick={addNewRegistration}/>
                    </Tooltip>
                </ButtonGroup>
            </HStack>
            <Grid width="100%" gap={{ base: 1, sm: 2, md: 3 }} templateColumns='repeat(1, min-content) repeat(2, auto) max-content'
                bg={useColorModeValue('gray.50', 'whiteAlpha.100')} p={{ base: 1, sm: 3, md: 5 }}
                borderRadius="lg">
                <TitleRow {...{registrations, addressLastUpdated, setRegistrations}}/>
                {registrations.map((_, i) => <EditRegistrationRow
                    {...{addressLastUpdated, registrations}}
                    index={i} key={i} setRegistrations={setRegistrations}
                    validation={getRegsitrationValidation(i)} />)}
            </Grid>
        </VStack>
    </VStack>        
}

type TitleRowProps = {
    registrations: Registration[],
    addressLastUpdated: Date,
    setRegistrations: (newRegistrations: Registration[]) => void
}


const TitleRow: React.FC<TitleRowProps> = ({registrations, addressLastUpdated, setRegistrations}) => {

    const markAllUpToDateLabel = "Mark all registrations up to date."

    function markAllAsUpToDate(){
        const newRegistrations = registrations.map(r => updateDate(r))
        setRegistrations(newRegistrations)
    }

    return <div style={{display: "contents"}}>
        <GridItem/>
        <GridItem>
            <HStack h="100%">
                <TitleHeading heading="Name"/>
                <AlphaSortButtons arr={registrations} setter={setRegistrations}
                    sortField={r => r.name} sortFieldDesc="name"/>
            </HStack>
        </GridItem>
        <GridItem>
            <HStack h="100%">
                <TitleHeading heading="Link"/>
                <AlphaSortButtons arr={registrations} setter={setRegistrations}
                    sortField={r => r.hyperlink ?? ""} sortFieldDesc="hyperlink"/>
            </HStack>
        </GridItem>
        <GridItem>
        <HStack justify="center" h="100%" paddingRight={2}>
                <TitleHeading heading="Last Updated"/>
                <HStack flexGrow={1}/>
                <Tooltip label={markAllUpToDateLabel} placement="top" openDelay={1500}>
                    <IconButton aria-label={markAllUpToDateLabel} bg="inherit"
                        icon={<Icon as={MdUpdate}/>} onClick={markAllAsUpToDate}/>
                </Tooltip>
                <AggregatedRegistrationUpdateStatusIcon {...{registrations, addressLastUpdated}}/>
            </HStack>
        </GridItem>
    </div>
}



type TitleHeadingProps = {
    heading: string
}

const TitleHeading: React.FC<TitleHeadingProps> = ({heading}) => {
    return <Heading
        fontWeight={600}
        fontSize={{ base: 's', sm: 'm', md: 'l' }}
        lineHeight={'110%'}>
    {heading}
    </Heading>
}

type EditRegistrationRowProps = {
    registrations: Registration[],
    index: number,
    setRegistrations: (newRegistrations: Registration[]) => void,
    addressLastUpdated: Date,
    validation: RegistrationValidationResult | null
}

const ItemTypes = {
    row: 'row'
}

function updateDate(r: Registration){
    r.addressLastUpdated = new Date()
    return r
}

const EditRegistrationRow: React.FC<EditRegistrationRowProps> = ({registrations, setRegistrations, index, addressLastUpdated, validation}) => {
    
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

    function updateRegistrationDate(){
        handleRegistrationChange(updateDate)
    }

    const handleMove = useCallback(function (from: number, to: number){
        const moveElement = registrations.splice(from, 1)[0]        
        if(moveElement !== undefined){
            registrations.splice(to, 0, moveElement)
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
    const updateButtonlLabel = "Mark registration as up to date"

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

    const nameValidationResult = validation?.name ?? null

    return <div style={{display: "contents", opacity: isDragging ? 0.5 : 1}} ref={drop}>
        <GridItem bg={isOver! ? 'cyan.400' : 'inherit'} borderRadius="lg" opacity="inherit">
            <ButtonGroup variant="ghost" isAttached>
                <IconButton aria-label={"Move registration up or down"}
                    icon={<Icon as={BiMoveVertical}/>} ref={drag} cursor="grab"/>
                <Tooltip label={deleteButtonLabel} placement="top" openDelay={1500}>
                    <IconButton aria-label={deleteButtonLabel}
                        icon={<Icon as={ImBin}/>} onClick={removeRegistration}/>
                </Tooltip>
            </ButtonGroup>
        </GridItem>
        <NameCell {...{name, handleInputRegistrationChange, nameValidationResult}} bg={inputBg}/>
        <HyperLinkCell {...{hyperlink: hyperlink ?? "", handleInputRegistrationChange}} bg={inputBg}/>
        <GridItem bg="inherit">
            <HStack bg={inputBg} borderRadius="lg" justify="center" paddingRight={2} paddingLeft={2}>
                <label>{registration.addressLastUpdated.toDateString()}</label>
                <HStack flexGrow={1}/>
                <Tooltip label={updateButtonlLabel} placement="top" openDelay={1500}>
                    <IconButton aria-label={updateButtonlLabel} bg="inherit"
                        icon={<Icon as={MdUpdate}/>} onClick={updateRegistrationDate}/>
                </Tooltip>
                <RegistrationUpdateStatusIcon {...{addressLastUpdated, registration}}/>
            </HStack>
        </GridItem>
    </div>
}

type GridCellProps = {
    handleInputRegistrationChange: (updater: (r: Registration, s: string) => Registration)
        => (e: React.ChangeEvent<HTMLInputElement>) => void
}

type NameCellProps = {
    name: string,
    bg: string,
    nameValidationResult: ValidationResult | null
} & GridCellProps

type DragItem = {
    dragIndex: number
}

const NameCell: React.FC<NameCellProps> = ({name,
handleInputRegistrationChange, bg, nameValidationResult}) => {

    const anyErrors = hasErrors(nameValidationResult)
    const props: InputProps = {
        value: name,
        onChange: handleInputRegistrationChange((r, s) => {return {...r, name: s}})
    }
    if(!name){
        props.placeholder="Add name"
    }
    return <GridItem bg="inherit">
        <FormControl isInvalid={anyErrors} isRequired>
            <Input {...props} bg={bg} borderRadius="lg" opacity="inherit"/>
            {
                nameValidationResult !== null ?
                    <FormErrorMessage>{ printMessages(nameValidationResult, ValidationSeverity.ERROR)}</FormErrorMessage>
                    :
                    <></>
            }            
        </FormControl>
    </GridItem>
}


type HyperLinkCellProps = {
    hyperlink: string,
    bg: string
} & GridCellProps

const HyperLinkCell: React.FC<HyperLinkCellProps> = ({hyperlink, handleInputRegistrationChange, bg}) => {
    const props: InputProps = {
        value: hyperlink,
        onChange: handleInputRegistrationChange((r, s) => {return {...r, hyperlink: s}})
    }
    if(!hyperlink){
        props.placeholder="Add optional hyperlink"
    }
    return <GridItem bg="inherit">
        <HStack>
            <Input {...props} bg={bg} borderRadius="lg" opacity="inherit"/>
            {hyperlink!!?  <Link href={hyperlink} target="_blank">
                    <Icon as={BsFillArrowUpRightSquareFill}/>
                </Link>
                : <></>
            }
        </HStack>
    </GridItem>
}