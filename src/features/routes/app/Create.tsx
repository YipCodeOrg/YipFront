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
                <FormControl id="name">
                    <FormLabel>Enter Your Address</FormLabel>
                    <Textarea
                    borderColor="gray.300"
                    _hover={{
                        borderRadius: 'gray.300',
                    }}
                    placeholder="123 Fake Street"
                    />
                </FormControl>
                <FormControl id="name" float="right">
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