import {
    Container,
    Flex,
    Box,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Textarea,
    Input,
  } from '@chakra-ui/react';
import { ChangeEvent } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { PageWithHeading } from '../../../../components/hoc/PageWithHeading';
import { Address } from '../../../../packages/YipStackLib/packages/YipAddress/core/address';
import { useCurrentCreateAddress, useIsRawCreateAddresInputLocked, useRawCreateAddress, useSetCreateAddressLine, useSetRawCreateAddress } from './createAddressSlice';
  
export default function CreateAddressWrapper() {
  
  const rawCreateAddress = useRawCreateAddress()
  const currentCreateAddress = useCurrentCreateAddress()
  const setRawAddress = useSetRawCreateAddress()
  const isRawInputLocked = useIsRawCreateAddresInputLocked()
  const setCreateAddressLine = useSetCreateAddressLine()

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>){
    const inputValue = e.target.value
    setRawAddress(inputValue)
  }
  
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

  const {
    rawCreateAddress,
    setRawAddress,
    currentCreateAddress,
    isRawInputLocked,
    setCreateAddressLine,
    handleInputChange
  } = props

  return <PageWithHeading heading="Create Address " icon={FaPlusCircle}>
    <Container maxW="full" mt={0} centerContent overflow="hidden">
        <Flex>
            <Box m={8}>
                <VStack spacing={5}>
                  <FormControl id="address" isRequired={true} 
                      isDisabled={isRawInputLocked}>
                      <FormLabel>Address</FormLabel>
                      <Textarea                  
                      borderColor="gray.300"
                      _hover={{
                          borderRadius: 'gray.300',
                      }}
                      placeholder={'Address line 1\nAddress line 2\nAddress line 3\n...'}
                      resize="both"
                      rows={5}
                      cols={25}
                      value={rawCreateAddress}
                      onChange={handleInputChange}
                      />
                      <Button
                      display={isRawInputLocked ? 'none' : 'initial'}
                      variant="solid"
                      _hover={{}}
                      onClick={() => setRawAddress("")}
                      marginTop={"5px"}>
                      Clear
                      </Button>
                  </FormControl>
                  {currentCreateAddress.addressLines.map((line, index) =>
                    (<AddressLine key={index} index={index} line={line}
                      setCreateAddressLine={setCreateAddressLine}/>))}
                </VStack>
            </Box>
        </Flex>
      </Container>
    </PageWithHeading>
}

type AddressLineProps = {line: string, index: number,
  setCreateAddressLine: (index: number, content: string) => void}

const AddressLine: React.FC<AddressLineProps> = ({line, index, setCreateAddressLine}) => {    

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value
    setCreateAddressLine(index, inputValue)
  }
  
  return <FormControl float="right">
      <Input
      _hover={{}}
      value={line}
      onChange={handleInputChange}
      />      
  </FormControl>
}