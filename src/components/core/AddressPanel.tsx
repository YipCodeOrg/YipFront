import { HStack, IconButton, Tooltip, useClipboard, VStack, Text, useColorModeValue, List, ListItem, StackProps } from "@chakra-ui/react"
import { FaCopy } from "react-icons/fa"
import { UserAddressData } from "../../packages/YipStackLib/types/userAddressData"

type AddressPanelProps = {
    selectedYipCode: string,
    selectedAddress: UserAddressData
} & StackProps

export const AddressPanel: React.FC<AddressPanelProps> = ({selectedYipCode, selectedAddress, ...rest}) =>{
    
    const addressLines = selectedAddress.address.address.addressLines
    const panelBg = useColorModeValue('gray.50', 'whiteAlpha.100')
    const itemBg = useColorModeValue('gray.200', 'gray.700')
    
    const { hasCopied, onCopy } = useClipboard(selectedYipCode)
    return <VStack  align="left" justify="top" maxW="100%" bg={panelBg} borderRadius="lg" p={4} {...rest}>        
        <VStack maxW="100%" align="left">      
            <Text as="u" textUnderlineOffset={3}>
                YipCode
            </Text>
            <HStack borderRadius="lg">
                <Text bg={itemBg} borderRadius="lg" p={2}>{selectedYipCode}</Text>
                {/*Non-MVP: Make tooltip disappear a fraction of a second after it's copied*/}
                <Tooltip label={hasCopied ? "YipCode Copied" : "Copy YipCode"} closeOnClick={false}>
                    <IconButton aria-label={"Click on this button to copy the YipCode to your clipboard"}
                        icon={<FaCopy/>} onClick={onCopy} bg="inherit"/>
                </Tooltip>
            </HStack>
        </VStack>
        <VStack id="dashboard-address" align="left">
            <Text as="u" textUnderlineOffset={3}>
                Address
            </Text>
            <HStack>
                <List>{addressLines.map(l => <AddressLine addressLine={l}/>)}</List>
            </HStack>
        </VStack>
    </VStack>
}

type AddressLineProps = {
    addressLine: string
}

const AddressLine: React.FC<AddressLineProps> = ({addressLine}) => {
    return <ListItem>
        {addressLine}
    </ListItem>
}