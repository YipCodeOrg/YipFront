import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import {
  GiHamburgerMenu as HamburgerIcon,
  MdClose as CloseIcon,
} from 'react-icons/all';
import { Link } from 'react-router-dom';
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from './Logo';

const Links = [["/", "Home"],
  ["/glossary", "Glossary"]];

const NavLink : React.FC<{path: string, text: string }> = ({path, text}) => (
  <Box
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),      
    }}
  >
    <Link to={path}>{text}</Link>    
  </Box>
);

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'} >                        
            <Link to={"/"}>
              <Logo lightCol='#000000' darkCol='#ffffff' size={47}/>                             
            </Link>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>                         
              {Links.map(([link, text]) => (
                <NavLink path={link} text={text}/>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <ColorModeSwitcher justifySelf="flex-end" />
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>                       
              {Links.map(([link, text]) => (
                <NavLink path={link} text={text}/>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}