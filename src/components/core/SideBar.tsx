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
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import {
  FiList,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { Link } from 'react-router-dom';
import React from 'react';

export type SideBarItemData = {
  key: string,
  name: string,
  icon: IconType,
  link: string
}

export type SideBarButtonData = {
  hoverText: string,
  icon: IconType,
  link: string
}

export type SidebarProps = {
    itemData: SideBarItemData[]
    buttonData: SideBarButtonData[]
    selectedItemKey: string | null
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <Flex minH="100%">
      <HStack minH="100%" bg={useColorModeValue('gray.100', 'gray.900')} display={{ base: 'none', md: 'block' }}>
        <StandardSideBar {...props}/>
      </HStack>
      <HStack display={{ base: 'flex', md: 'none' }}>
        <MobileSideBar {...props}/>
      </HStack>
    </Flex>    
  );
}

const StandardSideBar: React.FC<SidebarProps> = ({itemData, buttonData, selectedItemKey}) => {  
  return (    
      <SidebarContent
        onClose={() => {}}
        itemData={itemData}
        buttonData={buttonData}
        selectedItemKey={selectedItemKey}
        pos="relative"
        minH="100%"
      />
  );
}

const MobileSideBar: React.FC<SidebarProps> = ({itemData, buttonData, selectedItemKey}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100%" bg={useColorModeValue('gray.100', 'gray.900')}>
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent {...{onClose, itemData, buttonData, selectedItemKey, pos: "fixed"}}/>
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
    </Box>
  );
}

export default Sidebar

interface SidebarContentProps extends BoxProps {
  onClose: () => void;
  itemData: SideBarItemData[];
  buttonData: SideBarButtonData[]
  selectedItemKey: string | null
}

const SidebarContent = ({ onClose, itemData, buttonData, selectedItemKey, pos, ...rest }: SidebarContentProps) => {  
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos={pos ?? "initial"}
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">              
        {buttonData.map((item) => (
            <ButtonItem key={item.hoverText} icon={item.icon} hoverText={item.hoverText} link={item.link}/>          
          ))}
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {itemData.map((item) => (
        <SideBarItem key={item.key} icon={item.icon}
          content={item.name} link={item.link} isSelected={item.key === selectedItemKey}/>
      ))}
    </Box>
  );
};

interface ButtonItemProps extends FlexProps {
  icon: IconType;
  hoverText: string;
  link: string;
}

const ButtonItem = ({ icon, link, hoverText, ...rest }: ButtonItemProps) => {
  return (          
  <Tooltip label={hoverText}>    
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
                fontSize="28"
                _groupHover={{
                color: 'white',
                }}
                as={icon}
            />
          )}
      </Flex>
    </Link>
  </Tooltip>      
  );
};

interface SideBarItemProps extends FlexProps {
  icon: IconType;
  content: string;
  link: string;
  isSelected: boolean;
}
const SideBarItem = ({ icon, content: children, link, isSelected, ...rest }: SideBarItemProps) => {
  const selectedItemBg = useColorModeValue('gray.200', 'gray.600')
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
            bg={isSelected ? selectedItemBg: "initial"}
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
        icon={<FiList />}
      />    
    </Flex>
  );
};