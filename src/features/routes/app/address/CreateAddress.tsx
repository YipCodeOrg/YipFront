import {
    Button,
    VStack,
    FormControl,
    FormLabel,
    Textarea,
    Input,
    HStack,
  } from '@chakra-ui/react';
import { ChangeEvent, useEffect } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { PageWithHeading } from '../../../../components/hoc/PageWithHeading';
import { Address } from '../../../../packages/YipStackLib/packages/YipAddress/core/address';
import { useCurrentCreateAddress, useIsRawCreateAddresInputLocked, useRawCreateAddress, useSetCreateAddressLine, useSetRawCreateAddress } from './createAddressSlice';

export type CreateAddressWrapperProps = {
  initialRawAddress?: string | undefined
}

export default function CreateAddressWrapper({initialRawAddress}: CreateAddressWrapperProps) {
  
  const rawCreateAddress = useRawCreateAddress()
  const currentCreateAddress = useCurrentCreateAddress()
  const setRawAddress = useSetRawCreateAddress()
  const isRawInputLocked = useIsRawCreateAddresInputLocked()
  const setCreateAddressLine = useSetCreateAddressLine()

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
    isRawInputLocked,
    setCreateAddressLine,
    handleInputChange
  }}/>
}

type CreateAddressProps = {
  rawCreateAddress: string,
  setRawAddress: (newAddress: string) => void,
  currentCreateAddress: Address,
  isRawInputLocked: boolean,
  setCreateAddressLine: (index: number, content: string) => void,
  handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement>
}

export function CreateAddress(props: CreateAddressProps){

  return <PageWithHeading heading="Create Address " icon={FaPlusCircle}>
    <VStack spacing={5} display={{base: "inherit", md: "none"}}>
      <CreateAddressContent {...props} displayType="vertical"/>
    </VStack>
    <HStack w="90%" spacing={5} display={{base: "none", md: "inherit"}}>
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
    isRawInputLocked,
    setCreateAddressLine,
    handleInputChange,
    displayType
  } = props

  const rawAddressCols = displayType === "horizontal" ? 35 : 25

  return <>
    <VStack id="address">
        <FormLabel>Freeform Address</FormLabel>
        <FormControl isRequired={true} isDisabled={isRawInputLocked}>          
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
      <Button
      display={isRawInputLocked ? 'none' : 'initial'}
      variant="solid"
      _hover={{}}
      onClick={() => setRawAddress("")}>
      Clear
      </Button>
    </VStack>
    <VStack>
      {currentCreateAddress.addressLines.map((line, index) =>
        (<AddressLine key={index} index={index} line={line}
          setCreateAddressLine={setCreateAddressLine}/>))}
    </VStack>
  </>
}

type AddressLineProps = {line: string, index: number,
  setCreateAddressLine: (index: number, content: string) => void}

const AddressLine: React.FC<AddressLineProps> = ({line, index, setCreateAddressLine}) => {    

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value
    setCreateAddressLine(index, inputValue)
  }
  
  return <FormControl>
      <Input
      _hover={{}}
      value={line}
      onChange={handleInputChange}
      />      
  </FormControl>
}