import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import {
  FiMenu,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';

export type SideBarItemData = {
  name: string,
  icon: IconType,
  link: string
}

export type SimpleSidebarProps = {
    itemData: SideBarItemData[]
    children?: React.ReactNode
}

const SimpleSidebar: React.FC<SimpleSidebarProps> = ({itemData, children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
        itemData={itemData}
      >
        {children}
      </SidebarContent>
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent {...{onClose, itemData}}>{children}</SidebarContent>
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
    </Box>
  );
}

export default SimpleSidebar

interface SidebarContentProps extends BoxProps {
  onClose: () => void;
  itemData: SideBarItemData[];
}

const SidebarContent = ({ onClose, itemData, children, ...rest }: SidebarContentProps) => {  
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        {children}
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {itemData.map((item) => (
        <SideBarItem key={item.name} icon={item.icon} content={item.name} link={item.link}/>          
      ))}
    </Box>
  );
};

interface SideBarItemProps extends FlexProps {
  icon: IconType;
  content: string;
  link: string;
}
const SideBarItem = ({ icon, content: children, link, ...rest }: SideBarItemProps) => {
  return (
      <Link to={link}>
        <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
            bg: 'cyan.400',
            color: 'white',
            }}
            {...rest}>
            {icon && (
            <Icon
                mr="4"
                fontSize="16"
                _groupHover={{
                color: 'white',
                }}
                as={icon}
            />
            )}
            {children}
        </Flex>
      </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

    TODO: ADD BUTTONS
    </Flex>
  );
};