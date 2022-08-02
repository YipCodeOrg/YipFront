import {
    Container,
    Flex,
    Box,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Textarea,
  } from '@chakra-ui/react';
import { useCreateAddressState } from './createAddressSlice';
  
  export default function CreateAddress() {
    
    const [createAddressState, setCreateAddressState] = useCreateAddressState()

    const handleInputChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
      const inputValue = e.target.value
      setCreateAddressState(inputValue)
    }

    return (
      <Container maxW="full" mt={0} centerContent overflow="hidden">
        <Flex>
            <Box m={8}>
                <VStack spacing={5}>
                <FormControl id="address" isRequired={true}>
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
                    value={createAddressState.rawAddress}
                    onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl id="clear" float="right">
                    <Button
                    variant="solid"
                    _hover={{}}
                    onClick={() => setCreateAddressState("")}>
                    Clear
                    </Button>
                </FormControl>
                </VStack>
            </Box>
        </Flex>
      </Container>
    );
  }