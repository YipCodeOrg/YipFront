import {
    Button,
    VStack,
    FormControl,
    FormLabel,
    Textarea,
    Input,
    HStack,
    Heading,
    BoxProps,
    Box,
    Spacer,
    ButtonGroup,
    Tooltip,
    IconButton,
    Icon,
    useColorModeValue,
    Text,
    Popover,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    useDisclosure,
    PopoverTrigger,
    Flex
  } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { MdLabel } from 'react-icons/md';
import { InfoButton } from '../../../../components/core/InfoButton';
import { PageWithHeading } from '../../../../components/hoc/PageWithHeading';
import { Address, inverseAliasMap } from '../../../../packages/YipStackLib/packages/YipAddress/core/address';
import { useCreateAddressChangeCount, useCurrentCreateAddress, useAreThereCreateAddressChanges, useRawCreateAddress, useUpdateCreateAddressLines, useSetRawCreateAddress, useUndoCreateAddressChange } from './createAddressSlice';

export type CreateAddressWrapperProps = {
  initialRawAddress?: string | undefined
}

export default function CreateAddressWrapper({initialRawAddress}: CreateAddressWrapperProps) {
  
  const rawCreateAddress = useRawCreateAddress()
  const currentCreateAddress = useCurrentCreateAddress()
  const setRawAddress = useSetRawCreateAddress()
  const areThereChanges = useAreThereCreateAddressChanges()
  const updateCreateAddressLines = useUpdateCreateAddressLines()
  const undoChange = useUndoCreateAddressChange()
  const changeCount = useCreateAddressChangeCount()

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>){
    const inputValue = e.target.value
    setRawAddress(inputValue)
  }

  useEffect(() => {
    if(initialRawAddress !== undefined){
      setRawAddress(initialRawAddress)
    }    
  }, [initialRawAddress, setRawAddress])
  
  return <CreateAddress {...{
    rawCreateAddress,
    setRawAddress,
    currentCreateAddress,
    areThereChanges,
    updateCreateAddressLines,
    handleInputChange,
    undoChange,
    changeCount
  }}/>
}

type CreateAddressProps = {
  rawCreateAddress: string,
  setRawAddress: (newAddress: string) => void,
  currentCreateAddress: Address,
  areThereChanges: boolean,
  updateCreateAddressLines: (updater: (lines: string[]) => void) => void,
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>,
  undoChange: (count: number) => void
  changeCount: number
}

export function CreateAddress(props: CreateAddressProps){

  return <PageWithHeading heading="Create Address " icon={FaPlusCircle}>
    <VStack spacing={5} display={{base: "inherit", md: "none"}}>
      <CreateAddressContent {...props} displayType="vertical"/>
    </VStack>
    <HStack spacing={8} display={{base: "none", md: "inherit"}} w="100%" justify="center" p={20}
      align="flex-start">
      <CreateAddressContent {...props} displayType="horizontal"/>
    </HStack>
  </PageWithHeading>
}

type CreateAddressContentProps = {
  displayType: "horizontal" | "vertical"
} & CreateAddressProps

function CreateAddressContent(props: CreateAddressContentProps){
  const {
    rawCreateAddress,
    setRawAddress,
    currentCreateAddress,
    areThereChanges,
    updateCreateAddressLines,
    handleInputChange,
    displayType,
    undoChange,
    changeCount
  } = props

  const rawAddressCols = displayType === "horizontal" ? 35 : 25

  const freeFormInfo = "Enter a freeform address first. Each address line should be on a new line. As you type, the address will be broken out into lines which you will see appearing dynamically. When you are finished with the freeform address entry, you can start editing those lines further in the structured address entry, but once you do, you can no longer edit the freeform address."

  const structuredAddressInfo = "You can optionally make further changes to your address by editing the structured address data here. The address is broken into a sequence of address lines. You can add new lines, remove lines or edit existing lines. You can also give aliases to each line. Aliases allow you to define certain lines of your address as being special fields e.g. PostCode, State, County etc. Note: once there are changes made to the structured data, you can no longer make changes to the freeform address entry. To return to freeform editing, you need to undo all changes to the structured data."

  const invAliasMap : Map<number, Set<string>>
    = useMemo(() => inverseAliasMap(currentCreateAddress), [currentCreateAddress])

  function addBlankLine(){    
    updateCreateAddressLines(function(lines: string[]){      
      const numLines = lines.length
      lines[numLines] = ""
    })
  }

  return <>
    <VStack>
      <SequenceHeading text="Freeform Address Entry" infoMessage={freeFormInfo} sequenceNumber={1}/>      
      <Tooltip label="You can't modify the freeform address while there are further changes made to the structured address. At this point, you can either edit the structured address or, if you'd like to scratch those changes, then click Undo All and you can then return to editing the freeform address." isDisabled={!areThereChanges} openDelay={500}>
        <FormControl isRequired={true} isDisabled={areThereChanges}>   
          <FormLabel>Address</FormLabel>       
          <Textarea                  
          borderColor="gray.300"
          _hover={{
              borderRadius: 'gray.300',
          }}
          placeholder={'Address line 1\nAddress line 2\nAddress line 3\n...'}
          resize="both"
          rows={5}
          cols={rawAddressCols}
          value={rawCreateAddress}
          onChange={handleInputChange}          
          />
        </FormControl>
      </Tooltip>
      <Button
      display={areThereChanges ? 'none' : 'initial'}
      isDisabled={areThereChanges}
      variant="solid"
      _hover={{}}
      onClick={() => setRawAddress("")}>
      Clear
      </Button>
    </VStack>
    <VStack flexBasis="470px">
      <SequenceHeading text="Edit Structured Address" infoMessage={structuredAddressInfo} sequenceNumber={2}/>      
      {currentCreateAddress.addressLines.map((line, index) =>
        (<AddressLine key={index} index={index} line={line} invAliasMap={invAliasMap}
          updateCreateAddressLines={updateCreateAddressLines}/>))}
      <StructuredAddressButtons {...{undoChange, changeCount, areThereChanges, addBlankLine}}/>
    </VStack>
  </>
}

type StructuredAddressButtonsProps = {
  areThereChanges: boolean,
  undoChange: (count: number) => void,
  changeCount: number,
  addBlankLine: () => void
}

function StructuredAddressButtons(props: StructuredAddressButtonsProps){

  const { areThereChanges, undoChange, changeCount, addBlankLine } = props

  const addNewAddressLineTooltip = "Add a new address line"

  return <HStack w="100%" pr={2}>
    <Spacer/>
    {areThereChanges ? 
      <StructuredAddressUndoButtons {...{undoChange, changeCount}}/>
      : <></>}
    <Spacer/>
    <Tooltip label={addNewAddressLineTooltip} openDelay={1500}>
      <IconButton aria-label={addNewAddressLineTooltip} variant="ghost"
          icon={<Icon as={FaPlusCircle}/>} onClick={addBlankLine}/>
    </Tooltip>
  </HStack>
}

type StructuredAddressUndoButtonsProps = {
  undoChange: (count: number) => void,
  changeCount: number
}


function StructuredAddressUndoButtons(props: StructuredAddressUndoButtonsProps){

  const { undoChange, changeCount } = props
  
  return <ButtonGroup>
    <Tooltip placement='bottom' label="Undo the last change to the structured address" openDelay={1500}>
      <Button onClick={() => undoChange(1)}>Undo</Button>
    </Tooltip>
    <Tooltip placement='bottom' label="Undo all changes to the structured address" openDelay={1500}>
      <Button onClick={() => undoChange(changeCount)}>Undo all</Button>
    </Tooltip>
  </ButtonGroup>
}

type SequenceHeadingProps = {
  text: string,
  infoMessage: string,
  sequenceNumber: number
}

function SequenceHeading(props: SequenceHeadingProps){

  const { text, infoMessage, sequenceNumber } = props

  return <HStack pl={2}>
    <CircledDigit num={sequenceNumber}/>
    <Spacer/>
    <Heading size="md">{text}</Heading>
    <InfoButton {...{infoMessage}}/>
  </HStack>
}

type CircledDigitProps = {
  num: number
} & BoxProps

function CircledDigit(props: CircledDigitProps){
  const { num, ...rest } = props
  return <Box {...rest} borderColor="initial" pl={2} pr={2}
     borderRadius="50%" borderStyle="solid" borderWidth="initial">
    {num}
  </Box>
}

type AddressLineProps = {
  line: string,
  index: number,
  updateCreateAddressLines: (updater: (lines: string[]) => void) => void,
  invAliasMap : Map<number, Set<string>>
}

const AddressLine: React.FC<AddressLineProps> = (props) => {

  const {line, index, invAliasMap, updateCreateAddressLines} = props

  function setThisAddressLine(newVal: string){    
    updateCreateAddressLines(function(lines: string[]){
      lines[index] = newVal
    })
  }

  function deleteThisAddressLine(){
    updateCreateAddressLines(function(lines: string[]){      
      lines.splice(index, 1)
    })
  }

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value    
    setThisAddressLine(inputValue)
  }
  const deleteButtonLabel = "Delete this address line"
  
  return <HStack w="100%">
    <Tooltip label={deleteButtonLabel} placement="top" openDelay={1500}>
        <IconButton aria-label={deleteButtonLabel} variant="ghost"
            icon={<Icon as={ImBin}/>} onClick={deleteThisAddressLine}/>
    </Tooltip>
    <FormControl>
        <Input
        _hover={{}}
        value={line}
        onChange={handleInputChange}
        />      
    </FormControl>
    <AlliasPopoverTrigger {...{index, invAliasMap}}/>
  </HStack>
}

type AlliasPopoverTriggerProps = {
  index: number,
  invAliasMap : Map<number, Set<string>>
}

function AlliasPopoverTrigger(props: AlliasPopoverTriggerProps){
  
  const cardBg = useColorModeValue('gray.300', 'gray.700')
  const editAliasesTooltip = "Edit aliases for this address line"
  const { index, invAliasMap } = props

  const aliases = invAliasMap.get(index)
  const aliasList = useMemo(convertAliasesToList, [aliases])

  function convertAliasesToList(): string[]{
    if(aliases === undefined){
      return []
    } else {
      return [...aliases]
    }
  }

  let mainAlias =  ""

  if(aliases !== undefined && aliases.size > 0){
    const [firstAlias] = aliases
    if(firstAlias !== undefined){
      const truncated = firstAlias.substring(0, 10)      
      mainAlias = truncated.length < firstAlias.length
        ? `${truncated}...` : truncated
    }
  }

  const doneButtonBg = useColorModeValue('gray.50', 'gray.900')
  const popoverBg = useColorModeValue('gray.100', 'gray.700')
  const { isOpen, onToggle, onClose } = useDisclosure()

  return <HStack boxShadow="lg" bg={cardBg}
    borderRadius="lg" key={index} pl={{base: "none", md: 4}}>
      <Popover isOpen={isOpen} placement="left">      
        <Text display={{base: "none", md: "initial"}}>{mainAlias}</Text>          
        <PopoverTrigger>          
          <Flex w={0} h={0} p={0} m={0}/>
        </PopoverTrigger>
        <Tooltip openDelay={1500} label={editAliasesTooltip}>
          <IconButton aria-label={editAliasesTooltip} variant="ghost"
          icon={<Icon as={MdLabel}/>} onClick={onToggle} p={0}/>
        </Tooltip>
        <PopoverContent bg={popoverBg} style={{ margin: 0 }} maxW="70vw">
            <PopoverArrow />
            <PopoverCloseButton onClick={onClose}/>
            <PopoverHeader fontWeight={600}>Aliases - Line {index}</PopoverHeader>
            <PopoverBody>
              <Flex>
                {aliasList.map((a, i) => 
                  <AliasCard alias={a} key={i}/>)}
              </Flex>
            </PopoverBody>            
            <VStack p={4}>              
                <Button bg={doneButtonBg} onClick={onClose}>Done</Button>
            </VStack>    
        </PopoverContent>
    </Popover>      
  </HStack>
}

type AliasCardProps = {
  alias: string
}

function AliasCard(props: AliasCardProps){
  const { alias } = props
  const cardBg = useColorModeValue('gray.300', 'gray.800')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  return <HStack boxShadow="lg" bg={cardBg} borderRadius="lg" justify="center" p={1}
  onFocus={() => setIsEditing(true)} onBlur={() => setIsEditing(false)} onClick={() => setIsEditing(true)}>
    {isEditing ? <EditableAlias {...{alias}}/>
      : <ReadonlyAlias {...{alias}}/>}
  </HStack>
}

type ReadonlyAliasProps = {
  alias: string
}

function ReadonlyAlias(props: ReadonlyAliasProps){

  const { alias } = props
  const readonlyAliasBg = useColorModeValue('gray.100', 'gray.700')

  return <HStack bg={readonlyAliasBg} borderRadius="lg" justify="center" pl={2} pr={2}>
    <Text>{alias}</Text>
  </HStack>
}

type EditableAliasProps = {
  alias: string
}

function EditableAlias(props: EditableAliasProps){

  const { alias } = props

  return <Input value={alias} autoFocus/>
}