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
    Flex,
    StackProps,
    useToast
  } from '@chakra-ui/react';
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { BiHide } from 'react-icons/bi';
import { FaPlusCircle } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { MdLabel } from 'react-icons/md';
import { useForceable } from '../../../../app/hooks';
import { InfoButton } from '../../../../components/core/InfoButton';
import { PageWithHeading } from '../../../../components/hoc/PageWithHeading';
import { Address, AliasMap, inverseAliasMap } from '../../../../packages/YipStackLib/packages/YipAddress/core/address';
import { useCreateAddressChangeCount, useCurrentCreateAddress, useAreThereCreateAddressChanges, useRawCreateAddress, useUpdateCreateAddressLines, useSetRawCreateAddress, useUndoCreateAddressChange, useUpdateCreateAddressAliasMap } from './createAddressSlice';

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
  const updateAliasMap = useUpdateCreateAddressAliasMap()

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
    changeCount,
    updateAliasMap
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
  updateAliasMap: (updater: (aliases: AliasMap) => void) => void
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
    changeCount,
    updateAliasMap
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
          updateCreateAddressLines={updateCreateAddressLines} updateAliasMap={updateAliasMap}/>))}
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
  invAliasMap : Map<number, Set<string>>,
  updateAliasMap: (updater: (aliases: AliasMap) => void) => void
}

const AddressLine: React.FC<AddressLineProps> = (props) => {

  const {line, index, invAliasMap, updateCreateAddressLines,
   updateAliasMap} = props

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
    <AlliasPopover {...{index, invAliasMap, updateAliasMap}}/>
  </HStack>
}

type AlliasPopover = {
  index: number,
  invAliasMap : Map<number, Set<string>>,
  updateAliasMap: (updater: (aliases: AliasMap) => void) => void
}

function AlliasPopover(props: AlliasPopover){
  
  const cardBg = useColorModeValue('gray.300', 'gray.700')
  const editAliasesTooltip = "View & edit aliases for this address line"
  const addAliasTooltip = "Add another alias for this address line"
  const { index, invAliasMap, updateAliasMap } = props

  const aliases = invAliasMap.get(index)
  const aliasList = useMemo(convertAliasesToList, [aliases])

  function convertAliasesToList(): string[]{
    if(aliases === undefined){
      return []
    } else {
      return [...aliases]
    }
  }

  function addAlias(){
    updateAliasMap(function(map: AliasMap){      
      const existing = map[""]
      if(existing === undefined){
        map[""] = index
      } else {
        const oneBased = existing + 1
        console.warn(`Unexpected blank alias found at line ${oneBased}.`)
      }      
    })
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
            <PopoverCloseButton onClick={onClose} as={BiHide} size="m"/>
            <PopoverHeader fontWeight={600}>Aliases - Line {index}</PopoverHeader>
            <PopoverBody>
              <Flex gap={1} wrap="wrap">
                {aliasList.map((a, i) => 
                  <AliasCard alias={a} key={i} updateAliasMap={updateAliasMap} forceIsEditing={!a}/>)}
              </Flex>
              <Tooltip openDelay={1500} label={addAliasTooltip}>
                <IconButton aria-label={addAliasTooltip} variant="ghost"
                icon={<Icon as={FaPlusCircle}/>} onClick={addAlias} p={0}/>
              </Tooltip>       
            </PopoverBody>     
        </PopoverContent>
    </Popover>      
  </HStack>
}

type AliasCardProps = {
  alias: string,
  forceIsEditing: boolean,
  updateAliasMap: (updater: (aliases: AliasMap) => void) => void
}

function AliasCard(props: AliasCardProps){
  const { alias, updateAliasMap, forceIsEditing } = props
  const cardBg = useColorModeValue('gray.300', 'gray.800')
  const [isEditing, setIsEditing] = useForceable<boolean>(forceIsEditing)

  return <HStack boxShadow="lg" bg={cardBg} borderRadius="lg" justify="center" p={1}
    onBlur={() => setIsEditing(false)}>
    {isEditing ? <EditableAlias {...{alias, updateAliasMap}}/>
      : <ReadonlyAlias {...{alias}} onClick={() => setIsEditing(true)} maxW="100%"/>}
  </HStack>
}

type ReadonlyAliasProps = {
  alias: string
} & StackProps

function ReadonlyAlias(props: ReadonlyAliasProps){

  const { alias, ...rest } = props
  const readonlyAliasBg = useColorModeValue('gray.100', 'gray.700')
  const promptTextColor = useColorModeValue('gray.500', 'gray.500')

  return <HStack bg={readonlyAliasBg} borderRadius="lg" justify="center" pl={2} pr={2}
    {...rest}>
    {!!alias && <Text overflowWrap="break-word">{alias}</Text>}
    {!alias && <Text color={promptTextColor}>Enter text...</Text>}
  </HStack>
}

type EditableAliasProps = {
  alias: string,
  updateAliasMap: (updater: (aliases: AliasMap) => void) => void
}

function EditableAlias(props: EditableAliasProps){

  const { alias, updateAliasMap } = props
  const [val, setVal] = useState(alias)
  const toast = useToast()

  function handleInputChange(e: ChangeEvent<HTMLInputElement>){
    const inputValue = e.target.value
    setVal(inputValue)
  }

  function dispatchValue(){
    updateAliasMap(function(aliasMap){
      if(alias === val){
        return
      }
      const existing = aliasMap[val]
      if(existing === undefined){
        const index = aliasMap[alias]
        delete aliasMap[alias]
        if(index !== undefined){
          aliasMap[val] = index
        } else {
          throw new Error("Unexpected undefined index found in alias map");        
        }
      } else {
        const oneBased = existing + 1
        toast({
          title: "Aliase Update Error",
          description: `Alias ${val} already exists for line number ${oneBased}. You can't use the same alias for two different lines.`,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: "top"
        })
      }      
    })
  }

  return <Input value={val} onChange={handleInputChange} onBlur={dispatchValue} autoFocus/>
}