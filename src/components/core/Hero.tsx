import {
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Code,
  } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
  
  export default function Hero() {
    return (
      <>
        <Container maxW={'5xl'} display={{ base: 'none', md: 'block' }}>
          <Stack
            textAlign={'center'}
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}>
            <Heading
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}>
                  Yip<Code fontSize="xl">Code</Code>{' '}
              <Text as={'span'} color={'blue.400'}>
                  Your Internet Postcode.
              </Text>
            </Heading>
            <Text color={'gray.500'} maxW={'3xl'}>
              The future of postal address management is here.
            </Text>
            <Stack spacing={6} direction={'row'}>
              <Link to="/app">
                <Button
                  rounded={'full'}
                  px={6}
                  colorScheme={'blue'}
                  bg={'blue.400'}
                  _hover={{ bg: 'blue.500' }}>                  
                    Get Started
                </Button>
              </Link>
              <Button rounded={'full'} px={6}>
                  Learn More
              </Button>
            </Stack>
          </Stack>
        </Container>
        <Container display={{ base: 'flex', md: 'none' }}>          
          <Stack spacing={6}>
            <Heading
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}>
                  Yip<Code fontSize="xl">Code</Code>{' '}
            </Heading>
            <Link to="/app">
              <Button
                rounded={'full'}
                px={6}
                colorScheme={'blue'}
                bg={'blue.400'}
                _hover={{ bg: 'blue.500' }}>                  
                  Get Started
              </Button>
            </Link>
            <Button rounded={'full'} px={6}>
                Learn More
            </Button>
          </Stack>
        </Container>
      </>
    );
  }