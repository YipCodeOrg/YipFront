//TODO-UPD-2022-08

import {
    Box,
    Button,
    Divider,
    Heading,
    List,
    ListIcon,
    ListItem,
    Stack,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import { FaCheckCircle } from 'react-icons/fa';
  
  const individualOpts = [
    { id: 1, desc: 'Create YipCodes' },
    { id: 2, desc: 'View YipCodes' }
  ];
  interface PackageTierProps {
    title: string;
    options: Array<{ id: number; desc: string }>;
    typePlan: string;
    checked?: boolean;
  }
  const PackageTier = ({
    title,
    options,
    typePlan,
    checked = false,
  }: PackageTierProps) => {
    const colorTextLight = checked ? 'white' : 'blue.600';
    const bgColorLight = checked ? 'blue.400' : 'gray.300';
  
    const colorTextDark = checked ? 'white' : 'blue.500';
    const bgColorDark = checked ? 'blue.400' : 'gray.300';
  
    return (
      <Stack
        p={3}
        py={3}
        justifyContent={{
          base: 'flex-start',
          md: 'space-around',
        }}
        direction={{
          base: 'column',
          md: 'row',
        }}
        alignItems={{ md: 'center' }}>
        <Heading size={'md'}>{title}</Heading>
        <List spacing={3} textAlign="start">
          {options.map((desc, id) => (
            <ListItem key={desc.id}>
              <ListIcon as={FaCheckCircle} color="green.500" />
              {desc.desc}
            </ListItem>
          ))}
        </List>
        <Heading size={'xl'}>{typePlan}</Heading>
        <Stack>
          <Button
            size="md"
            color={useColorModeValue(colorTextLight, colorTextDark)}
            bgColor={useColorModeValue(bgColorLight, bgColorDark)}>
            {/*TODO: Link this to the same "Get Started" page as the one linked from Hero*/}
            Get Started
          </Button>
        </Stack>
      </Stack>
    );
  };
  // eslint-disable-next-line
  const FfOffPricing = () => {
    return (
      <Box py={6} px={5}>
        <Stack spacing={4} width={'100%'} direction={'column'}>
          <Stack
            p={5}
            alignItems={'center'}
            justifyContent={{
              base: 'flex-start',
              md: 'space-around',
            }}
            direction={{
              base: 'column',
              md: 'row',
            }}>
            <Stack
              width={{
                base: '100%',
                md: '40%',
              }}
              textAlign={'center'}>
              <Heading size={'lg'}>
                YipCode is Free<Text color="blue.400">For Individuals</Text>
              </Heading>
            </Stack>
            <Stack
              width={{
                base: '100%',
                md: '60%',
              }}>
              <Text textAlign={'center'}>
                YipCode is free to use for individuals. We plan to keep it that way. Feel free to sign up as an individual and start using YipCode today! For businesses, we plan to introduce premium features and pricing models. Stay tuned!
              </Text>
            </Stack>
          </Stack>
          <Divider />
          <PackageTier title={'Individual'} 
            checked={true} typePlan="Free" options={individualOpts} />
          {/*TODO-UPD-2022-10:
          <Divider />
          <PackageTier
            title={'Lorem Plus'}
            typePlan="$32.00"
            options={TODO}
          />
          <Divider />
            <PackageTier title={'Lorem Pro'} typePlan="$50.00" options={TODO} />*/}
        </Stack>
      </Box>
    );
  };

  //TODO-FF-APLV: Remove this and export FfOffPricing
  const Pricing = () => {
    return <>We will introduce pricing models when we launch the app. We are planning to make this free for individuals.</>
  }

  export default Pricing;

