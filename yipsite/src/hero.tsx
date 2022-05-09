import {
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Code,
  } from '@chakra-ui/react';
  
  export default function Hero() {
    return (
      <Container maxW={'5xl'}>
        <Stack
          textAlign={'center'}
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
                <b>Yip</b><Code fontSize="xl">Code</Code>{' '}
            <Text as={'span'} color={'blue.400'}>
                <b>Y</b>our <b>I</b>nternet <b>P</b>ostcode.
            </Text>
          </Heading>
          <Text color={'gray.500'} maxW={'3xl'}>
            The future of postal address management is here.
          </Text>
          <Stack spacing={6} direction={'row'}>
            <Button
              rounded={'full'}
              px={6}
              colorScheme={'blue'}
              bg={'blue.400'}
              _hover={{ bg: 'blue.500' }}>
                Get Started
            </Button>
            <Button rounded={'full'} px={6}>
                Learn More
            </Button>
          </Stack>
        </Stack>
      </Container>
    );
  }