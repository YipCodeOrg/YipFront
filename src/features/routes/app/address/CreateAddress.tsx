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
import { useAppDispatch, useForceable, useValidation } from '../../../../app/hooks';
import { InfoButton } from '../../../../components/core/InfoButton';
import { PageWithHeading } from '../../../../components/hoc/PageWithHeading';
import { ValidationComponentProps, ValidationControl } from '../../../../components/hoc/ValidationControl';
import { Address, AliasMap, inverseAliasMap, removeAlias } from '../../../../packages/YipStackLib/packages/YipAddress/types/address/address';
import { parseStrToAddress } from '../../../../packages/YipStackLib/packages/YipAddress/types/address/parseAddress';
import { handleKeyPress, handleValueChange } from '../../../../packages/YipStackLib/packages/YipAddress/util/event';
import { hasErrors, hasWarnings, printMessages, ValidationResult, ValidationSeverity } from '../../../../packages/YipStackLib/packages/YipAddress/validate/validation';
import { CreateAddressData } from '../../../../packages/YipStackLib/types/address/address';
import { CreateAddressValidationResult, validateCreateAddress } from '../../../../packages/YipStackLib/types/address/validateAddress';
import { createAction, UndoActionType } from '../../../../util/undo/undoActions';
import { useCurrentCreateAddress, useUpdateCreateAddressLines, useUpdateCreateAddressAliasMap, useCreateAddressName, clearAddress, useCreateAddressHistoryLength, useRawAddress } from './createAddressSlice';

export type CreateAddressWrapperProps = {
  initialRawAddress?: string | undefined
}

export default function CreateAddressWrapper({initialRawAddress}: CreateAddressWrapperProps) {
  
  const [rawAddress, setRawAddress] = useRawAddress()
  const currentCreateAddress = useCurrentCreateAddress()  
  const isAddressCleared = currentCreateAddress === null
  const numChanges = useCreateAddressHistoryLength()
  const areThereChanges = numChanges > 0
  const { name, setName, deleteName } = useCreateAddressName()
  const effectiveStructuredAddress = useMemo(computeEffectiveStructuredAddress, [rawAddress, currentCreateAddress])
  const updateCreateAddressLines = useUpdateCreateAddressLines(effectiveStructuredAddress)
  const updateAliasMap = useUpdateCreateAddressAliasMap(effectiveStructuredAddress)
  const dispatch = useAppDispatch()  

  const handleRawAddressChange = handleValueChange(setRawAddress)

  useEffect(() => {
    if(initialRawAddress !== undefined){
      setRawAddress(initialRawAddress)
    }    
  }, [initialRawAddress, setRawAddress])

  const effectiveName: string = name ?? ""

  function getCreateAddressData(): CreateAddressData{
    const data: CreateAddressData = {      
      address: effectiveStructuredAddress
    }

    if(!!name){
      data.name = name
    }

    return data
  }

  // If user enters a name and then afterwards blanks it out completely, then remove the name altogether
  function effectiveSetName(n: string){
    if(!n){
      deleteName()
    } else {
      setName(n)
    }
  }

  function computeEffectiveStructuredAddress(){
    if(currentCreateAddress !== null){
      return currentCreateAddress
    } else {
      return parseStrToAddress(rawAddress)
    }
  }

  function undo(){
    dispatch(createAction(UndoActionType.UndoCreateAddress))
  }

  function clearStructuredAddress(){
    dispatch(clearAddress())
  }

  const { validation, updateValidation } = useValidation(getCreateAddressData,
      validateCreateAddress, v => v.topValidationResult, [name, effectiveStructuredAddress])

  function submitChanges(){
    // TODO - add logic to actually submit the changes
  }
  
  return <CreateAddress {...{
    rawAddress,
    setRawAddress,
    structuredAddress: effectiveStructuredAddress,
    isAddressCleared,
    areThereChanges,
    updateCreateAddressLines,
    handleRawAddressChange,
    undo,
    clearStructuredAddress,
    updateAliasMap,
    addressName: effectiveName,
    setAddressName: effectiveSetName,
    validation,
    submitChanges,
    revalidate: updateValidation
  }}/>
}

type CreateAddressProps = {
  rawAddress: string,
  setRawAddress: (newAddress: string) => void,
  structuredAddress: Address,
  isAddressCleared: boolean,
  areThereChanges: boolean,
  updateCreateAddressLines: (updater: (lines: string[]) => void) => void,
  handleRawAddressChange: React.ChangeEventHandler<HTMLTextAreaElement>,
  updateAliasMap: (updater: (aliases: AliasMap) => void) => void
  undo: () => void,
  clearStructuredAddress: () => void,
  addressName: string,
  setAddressName: (n: string) => void,
  validation: CreateAddressValidationResult | null,
  submitChanges: () => void,
  revalidate: () => ValidationResult
}

export function CreateAddress(props: CreateAddressProps){

  const { areThereChanges, undo, validation, submitChanges, revalidate } = props

  return <PageWithHeading heading="Create Address " icon={FaPlusCircle}>
    <VStack spacing={5} display={{base: "inherit", md: "none"}}>
      <CreateAddressContent {...props} displayType="vertical"/>
    </VStack>
    <HStack spacing={8} display={{base: "none", md: "inherit"}} w="100%" justify="center" pt={20}
      align="flex-start">
      <CreateAddressContent {...props} displayType="horizontal"/>
    </HStack>
    <VStack justify="flex-start">
      <CreateAddressButtons {...{areThereChanges, undo, validation, submitChanges, revalidate}}/>
      <Spacer/>
    </VStack>
  </PageWithHeading>
}

type CreateAddressContentProps = {
  displayType: "horizontal" | "vertical"
} & CreateAddressProps

function CreateAddressContent(props: CreateAddressContentProps){
  const {
    rawAddress: rawCreateAddress,
    setRawAddress,
    structuredAddress,
    isAddressCleared,
    areThereChanges,
    updateCreateAddressLines,
    handleRawAddressChange,
    displayType,
    undo,
    clearStructuredAddress,
    updateAliasMap,
    addressName,
    setAddressName
  } = props

  const rawAddressCols = displayType === "horizontal" ? 35 : 25

  const freeFormInfo = "Enter a freeform address first. Each address line should be on a new line. As you type, the address will be broken out into lines which you will see appearing dynamically. When you are finished with the freeform address entry, you can start editing those lines further in the structured address entry, but once you do, you can no longer edit the freeform address."

  const structuredAddressInfo = "You can optionally make further changes to your address by editing the structured address data here. The address is broken into a sequence of address lines. You can add new lines, remove lines or edit existing lines. You can also give aliases to each line. Aliases allow you to define certain lines of your address as being special fields e.g. PostCode, State, County etc. Note: once there are changes made to the structured data, you can no longer make changes to the freeform address entry. To return to freeform editing, you need to clear all changes to the structured data."

  const invAliasMap : Map<number, Set<string>>
    = useMemo(() => inverseAliasMap(structuredAddress), [structuredAddress])

  function addBlankLine(){    
    updateCreateAddressLines(function(lines: string[]){      
      const numLines = lines.length
      lines[numLines] = ""
    })
  }

  const isRawAddressCleared = !rawCreateAddress

  return <>
    <VStack>
      <SequenceHeading text="Freeform Address Entry" infoMessage={freeFormInfo} sequenceNumber={1}/>      
      <FormControl isRequired={false}>
        <FormLabel>Address Name</FormLabel>       
        <Input value={addressName} onChange={handleValueChange(setAddressName)}/>
      </FormControl>
      <Tooltip label="You can't modify the freeform address while there are further changes made to the structured address. At this point, you can either edit the structured address or, if you'd like to scratch those changes, then click on the button to clear all changes to the structured address and you can then return to editing the freeform address." isDisabled={isAddressCleared} openDelay={500}>
        <FormControl isDisabled={!isAddressCleared}>
          <FormLabel>Freeform Address</FormLabel>       
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
          onChange={handleRawAddressChange}          
          />
        </FormControl>
      </Tooltip>
      <Button
      display={isRawAddressCleared ? 'none' : 'initial'}
      isDisabled={isRawAddressCleared}
      variant="solid"
      _hover={{}}
      onClick={() => setRawAddress("")}>
      Clear
      </Button>
    </VStack>
    <VStack flexBasis={displayType === 'horizontal' ? "470px" : "initial"}>
      <SequenceHeading text="Edit Structured Address" infoMessage={structuredAddressInfo} sequenceNumber={2}/>      
      {structuredAddress.addressLines.map((line, index) =>
        (<AddressLine key={index} index={index} line={line} invAliasMap={invAliasMap}
          updateCreateAddressLines={updateCreateAddressLines} updateAliasMap={updateAliasMap}/>))}
      <StructuredAddressButtons {...{undo, clearStructuredAddress, isAddressCleared, addBlankLine, areThereChanges}}/>
    </VStack>
  </>
}

type CreateAddressButtonsProps = {
  areThereChanges: boolean,
  undo: () => void,
  validation: CreateAddressValidationResult | null,
  revalidate: () => ValidationResult,
  submitChanges: () => void
}

function CreateAddressButtons(props: CreateAddressButtonsProps){

  const { areThereChanges, undo, validation, revalidate, submitChanges } = props

  const undoLabel = areThereChanges ? "Undo the last change to the structured address" :
    "There are no changes to undo"
  const saveLabel = "Save this address"
  return <ButtonGroup>
    <Tooltip placement='bottom' label={undoLabel} openDelay={1500} shouldWrapChildren>
        <Button onClick={undo} isDisabled={!areThereChanges}>Undo</Button>
    </Tooltip>
    <SubmitChangesButton {...{tooltipLabel: saveLabel, text: "Save",
      validation: validation?.topValidationResult ?? null, submitChanges, revalidate}}/>
  </ButtonGroup>
}

type SubmitChangesButtonProps = {
  tooltipLabel: string,
  text: string,
  validation: ValidationResult | null,
  revalidate: () => ValidationResult,
  submitChanges: () => void
}

function SubmitChangesButton(props: SubmitChangesButtonProps){

  const { text, validation, tooltipLabel, submitChanges, revalidate } = props

  const hasValidationErrors = hasErrors(validation)  

  const validationErrorMessage = hasValidationErrors ?
    printMessages(validation, ValidationSeverity.ERROR) : ""

  function render({isInvalid} : ValidationComponentProps){
    return <SubmitChangesButtonInner {...{tooltipLabel, actionName: text, submitChanges,
      validation, isInvalid, revalidate}}/>
  }

  return <ValidationControl {...{render, validationErrorMessage}} isInvalid={hasValidationErrors}/>
}

type SubmitChangesButtonInnerProps = {
  tooltipLabel: string,
  actionName: string,
  isInvalid: boolean,
  validation: ValidationResult | null,
  revalidate: () => ValidationResult,
  submitChanges: () => void
}

function SubmitChangesButtonInner(props: SubmitChangesButtonInnerProps){

  const { actionName, isInvalid, tooltipLabel, submitChanges, validation, revalidate } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const confirmButtonBg = useColorModeValue('gray.50', 'gray.900')
  const [warningMessages, setWarningMessages] = useState<string>("")

  function submitValidationAction(){
    if(isInvalid){
      throw new Error("Submit unexpectedly called with invalid data");      
    }
    const effectiveValidation = validation ?? revalidate()
    const valHasErrors = hasErrors(effectiveValidation)
    if(!valHasErrors){
      const valHasWarnings = hasWarnings(effectiveValidation)
      if(valHasWarnings){
        setWarningMessages(printMessages(effectiveValidation, ValidationSeverity.WARNING))
        onOpen()
      } else {
        submitChanges()
      }
    }    
  }  

  function confirmAction(){
    onClose()
    submitChanges()
  }

  return <Popover isOpen={isOpen}>
    <PopoverTrigger>             
        <Flex w={0} h={0} p={0} m={0}/>
    </PopoverTrigger>
    <Tooltip placement='bottom' label={tooltipLabel} openDelay={1500} shouldWrapChildren>
      <Button isDisabled={isInvalid} onClick={submitValidationAction}>{actionName}</Button>
    </Tooltip>
    <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton onClick={onClose}/>
        <PopoverHeader fontWeight={600}>{`Confirm ${actionName}`}</PopoverHeader>
        <PopoverBody>
            {`Are you sure you want to ${actionName}? The following validation warnings were found: ${warningMessages}`}
        </PopoverBody>
        <VStack p={4}>
            <Button bg={confirmButtonBg} onClick={confirmAction}>{`Yes, I want to ${actionName}`}</Button>
        </VStack>    
    </PopoverContent>
  </Popover>
}

type StructuredAddressButtonsProps = {
  isAddressCleared: boolean,
  areThereChanges: boolean,
  clearStructuredAddress: () => void,
  addBlankLine: () => void
}

function StructuredAddressButtons(props: StructuredAddressButtonsProps){

  const { isAddressCleared, clearStructuredAddress,
    addBlankLine, areThereChanges } = props

  const addNewAddressLineTooltip = "Add a new address line"
  const areButtonsVisible = !isAddressCleared

  return <HStack w="100%" pr={2}>
    <Spacer/>
      {areButtonsVisible && <StructuredAddressClearButton {...{clearStructuredAddress,
          areThereChanges, isAddressCleared}}/>}
    <Spacer/>
    <Tooltip label={addNewAddressLineTooltip} openDelay={1500}>
      <IconButton aria-label={addNewAddressLineTooltip} variant="ghost"
          icon={<Icon as={FaPlusCircle}/>} onClick={addBlankLine}/>
    </Tooltip>
  </HStack>
}

type StructuredAddressClearButtonProps = {
  isAddressCleared: boolean,
  clearStructuredAddress: () => void
}

function StructuredAddressClearButton(props: StructuredAddressClearButtonProps){

  const { clearStructuredAddress, isAddressCleared } = props

  const clearLabel = isAddressCleared ? "There are no changes to clear" : 
    "Clear changes to the structured address"  
  
  return <ButtonGroup>
    <Tooltip placement='bottom' label={clearLabel} openDelay={1500} shouldWrapChildren>
      <Button onClick={clearStructuredAddress} isDisabled={isAddressCleared}>Clear</Button>
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

  return <HStack boxShadow="lg" bg={cardBg} borderRadius="lg" justify="center" p={1} className='alias-card'>
    {isEditing ? <EditableAlias {...{alias, updateAliasMap, setIsEditing}}/>
      : <ReadonlyAlias {...{alias, updateAliasMap}} onClick={() => setIsEditing(true)} maxW="100%"/>}
  </HStack>
}

type ReadonlyAliasProps = {
  alias: string,
  updateAliasMap: (updater: (aliases: AliasMap) => void) => void
} & StackProps

function ReadonlyAlias(props: ReadonlyAliasProps){

  const { alias, updateAliasMap, ...rest } = props
  const readonlyAliasBg = useColorModeValue('gray.100', 'gray.700')
  const promptTextColor = useColorModeValue('gray.500', 'gray.500')
  const deleteButtonLabel = "Delete this alias"

  function deleteThisAlias(){
    updateAliasMap(function(aliasMap){
      removeAlias(aliasMap, alias)
    })
  }

  return <HStack maxW="100%">
    <Tooltip label={deleteButtonLabel} placement="top" openDelay={1500}>
        <IconButton aria-label={deleteButtonLabel} variant="ghost" size="s"
          icon={<Icon as={ImBin} w="inherit" h="inherit"/>} onClick={deleteThisAlias}
          sx={{
            w: '10px',
            h: '10px',
            '.alias-card:hover &': {
              w: '20px',
              h: '20px',
          },
        }}/>
    </Tooltip>
    <HStack bg={readonlyAliasBg} borderRadius="lg" justify="center" pl={2} pr={2}
      h="100%" maxW="100%" {...rest}>
      {!!alias && <Text maxW="100%" overflowWrap="anywhere">{alias}</Text>}
      {!alias && <Text color={promptTextColor}>Enter text...</Text>}
    </HStack>
  </HStack>
}

type EditableAliasProps = {
  alias: string,
  updateAliasMap: (updater: (aliases: AliasMap) => void) => void,
  setIsEditing: (b: boolean) => void
}

function EditableAlias(props: EditableAliasProps){

  const { alias, updateAliasMap, setIsEditing } = props
  const [val, setVal] = useState(alias)
  const toast = useToast()

  function handleInputChange(e: ChangeEvent<HTMLInputElement>){
    const inputValue = e.target.value
    setVal(inputValue)
  }

  function dispatchValue(){
    setIsEditing(false)
    updateAliasMap(function(aliasMap){
      if(!val){
        removeAlias(aliasMap, alias)
        return
      }
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

  const keyPressHandlers = {
    Enter: dispatchValue,
    Escape: dispatchValue
  }

  return <Input value={val} onChange={handleInputChange} onBlur={dispatchValue} autoFocus
    onKeyDown={handleKeyPress(keyPressHandlers)}/>
}