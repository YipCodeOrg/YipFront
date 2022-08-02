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
  
  export default function contact() {
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
                    />
                </FormControl>
                <FormControl id="nextButton" float="right">
                    <Button
                    variant="solid"
                    _hover={{}}>
                    Next
                    </Button>
                </FormControl>
                </VStack>
            </Box>
        </Flex>
      </Container>
    );
  }