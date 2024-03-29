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
  UseDisclosureReturn,
} from '@chakra-ui/react';
import { GiHamburgerMenu as HamburgerIcon } from 'react-icons/gi';
import { MdClose as CloseIcon} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { appAbs, glossaryAbs } from '../routing/routeStrings';
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from './Logo';

const links: [link: string, path:string][] = [["/", "Home"],
  [glossaryAbs, "Glossary"]];

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

type NavBarWrapperProps = {
  isLoggedIn: boolean
  isSignedUp: boolean
  setIsSigedUp: (b: boolean) => void
}

const HUB_AUTH_INIT_URL = `${process.env.REACT_APP_HUB_ORIGIN_URL}/auth/init`
const HUB_LOGOUT_INIT_URL = `${process.env.REACT_APP_HUB_ORIGIN_URL}/logout/init`


/* TODO: Figure out links / buttons for app vs. site. 
   Perhaps the NavBar can be parametrised for use in different contexts e.g. by making Links / buttons props
*/
const NavBarWrapper: React.FC<NavBarWrapperProps> = (props) => {
  const disclosure = useDisclosure();
  return <NavBar {...{...disclosure,  ...props}} />  
}

export type NavbarProps = UseDisclosureReturn & NavBarWrapperProps

export const NavBar: React.FC<NavbarProps> = ({isLoggedIn, isSignedUp, setIsSigedUp, isOpen, onOpen, onClose}) => {
  return (
    <>
      <Box bg={useColorModeValue('gray.50', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'} >                        
            <Link to={appAbs}>
              <Logo lightCol='#000000' darkCol='#ffffff' size={47}/>                             
            </Link>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>                         
              {links.map(([link, text]) => (
                <NavLink key={link} path={link} text={text}/>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <ColorModeSwitcher justifySelf="flex-end" padding={3}/>
            <Menu>
              <MenuButton
                padding={3}
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                />
              </MenuButton>
              {isLoggedIn ?
                <MenuList>
                  <MenuDivider/>
                  <MenuItem onClick={() => window.location.replace(HUB_LOGOUT_INIT_URL)}>Logout</MenuItem>
                </MenuList>
                :
                <MenuList>
                  <MenuDivider/>
                  {
                    isSignedUp ?
                    <MenuItem onClick={redirectLoginSignup()}>Login / Signup</MenuItem>
                    :
                    <MenuItem onClick={redirectSignupLogin()}>Signup / Login</MenuItem>
                  }                  
                </MenuList>
              }
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>                       
              {links.map(([link, text]) => (
                <NavLink key ={link} path={link} text={text}/>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );

  function redirectSignupLogin() {
    setIsSigedUp(true)
    return () => window.location.replace(`${HUB_AUTH_INIT_URL}?action=signup&postLoginRedirect=${encodeURIComponent(appAbs)}`);
  }

  function redirectLoginSignup() {
    return () => window.location.replace(`${HUB_AUTH_INIT_URL}?action=login&postLoginRedirect=${encodeURIComponent(appAbs)}`);
  }
}

export default NavBarWrapper