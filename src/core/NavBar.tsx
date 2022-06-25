import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Avatar,
} from '@chakra-ui/react';
import {
  GiHamburgerMenu as HamburgerIcon,
  MdClose as CloseIcon,
} from 'react-icons/all';
import { Link } from 'react-router-dom';
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from './Logo';

const Links = [["/", "Home"],
  ["/site/glossary", "Glossary"]];

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

/* TODO: Figure out links / buttons for app vs. site. 
   Perhaps the NavBar can be parametrised for use in different contexts e.g. by making Links / buttons props
*/
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
            <Link to={"/app"}>
              <Logo lightCol='#000000' darkCol='#ffffff' size={47}/>                             
            </Link>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>                         
              {Links.map(([link, text]) => (
                <NavLink key={link} path={link} text={text}/>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <ColorModeSwitcher justifySelf="flex-end" />
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
              </MenuButton>
              <MenuList>
                <MenuItem>Link 1</MenuItem>
                <MenuItem>Link 2</MenuItem>
                <MenuDivider />
                <MenuItem>Link 3</MenuItem>
              </MenuList>
            </Menu>
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