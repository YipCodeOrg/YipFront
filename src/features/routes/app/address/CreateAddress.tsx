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
    Icon
  } from '@chakra-ui/react';
import { ChangeEvent, useEffect } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { InfoButton } from '../../../../components/core/InfoButton';
import { PageWithHeading } from '../../../../components/hoc/PageWithHeading';
import { Address } from '../../../../packages/YipStackLib/packages/YipAddress/core/address';
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
    <VStack flexBasis="420px">
      <SequenceHeading text="Edit Structured Address" infoMessage={structuredAddressInfo} sequenceNumber={2}/>      
      {currentCreateAddress.addressLines.map((line, index) =>
        (<AddressLine key={index} index={index} line={line}
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

type AddressLineProps = {line: string, index: number,
  updateCreateAddressLines: (updater: (lines: string[]) => void) => void}

const AddressLine: React.FC<AddressLineProps> = ({line, index, updateCreateAddressLines}) => {

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
  </HStack>
}