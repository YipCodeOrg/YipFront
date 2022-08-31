import { HStack, VStack, Text, useColorModeValue, List, ListItem, StackProps, Spacer } from "@chakra-ui/react"    
import { printAddress } from "../../packages/YipStackLib/packages/YipAddress/core/address"
import { AddressItem } from "../../packages/YipStackLib/types/userAddressData"
import { CopyTextButton } from "./CopyTextButton"

type AddressPanelProps = {
    addressItem: AddressItem
} & StackProps

export const AddressPanel: React.FC<AddressPanelProps> = ({addressItem, ...rest}) =>{
    
    const address = addressItem.address
    const yipCode = addressItem.yipCode
    const addressLines = address.addressLines
    const addressString = printAddress(address, "\n")    
    const panelBg = useColorModeValue('gray.50', 'whiteAlpha.100')

    return <VStack>
        <HStack justify="left" w="100%">
            <label>Address Details</label>
            <Spacer/>
        </HStack>
        <VStack align="left" justify="top" maxW="100%" bg={panelBg} borderRadius="lg" p={4} {...rest}>        
            <VStack maxW="100%" align="left">      
                <Text as="u" textUnderlineOffset={3}>
                    YipCode
                </Text>
                <HStack borderRadius="lg">
                    <Text boxShadow='outline' borderRadius="lg" p={2}>{yipCode}</Text>
                    <CopyTextButton text={yipCode} copiedMsg="YipCode copied" copyMsg="Copy YipCode"
                        placement="top"/>
                </HStack>
            </VStack>
            <VStack id="dashboard-address" align="left">
                <Text as="u" textUnderlineOffset={3}>
                    Address
                </Text>
                <HStack align="flex-start">
                    <List boxShadow='outline' borderRadius="lg" p={2}>
                        {addressLines.map(l => <AddressLine addressLine={l}/>)}
                    </List>
                    <CopyTextButton text={addressString} copiedMsg="Address copied" copyMsg="Copy Address"
                        placement="top"/>
                </HStack>
            </VStack>
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