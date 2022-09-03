import { HStack, VStack, Text, useColorModeValue, List, ListItem, StackProps, Spacer } from "@chakra-ui/react"    
import { printAddress } from "../../packages/YipStackLib/packages/YipAddress/core/address"
import { AddressItem } from "../../packages/YipStackLib/types/userAddressData"
import { CopyTextButton } from "./CopyTextButton"

type AddressPanelProps = {
    addressItem: AddressItem,
    displayYipCode: boolean
} & StackProps

export const AddressPanel: React.FC<AddressPanelProps> = ({addressItem, displayYipCode, ...rest}) =>{
    
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
            <LabelledYipCodeContent {...{yipCode, displayYipCode}} display={displayYipCode? "inherit" : "none"}/>
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

export type LabelledYipCodeContentProps = {
    yipCode: string
} & StackProps

export const LabelledYipCodeContent: React.FC<LabelledYipCodeContentProps> = (props) => {
    
    const {yipCode, ...rest} = props

    return <VStack maxW="100%" align="left" {...rest}>
        <Text as="u" textUnderlineOffset={3}>
            YipCode
        </Text>
        <YipCodeAndCopyButton {...{yipCode}}/>
    </VStack>
}

export type YipCodeAndCopyButtonProps = {
    yipCode: string
} & StackProps


export const YipCodeAndCopyButton: React.FC<YipCodeAndCopyButtonProps> = ({yipCode, ...rest}) => {
    return <HStack borderRadius="lg" {...rest}>
        <Text boxShadow='outline' borderRadius="lg" p={2}>{yipCode}</Text>
        <CopyTextButton text={yipCode} copiedMsg="YipCode copied" copyMsg="Copy YipCode"
            placement="top"/>
    </HStack>
}

type AddressLineProps = {
    addressLine: string
}

const AddressLine: React.FC<AddressLineProps> = ({addressLine}) => {
    return <ListItem>
        {addressLine}
    </ListItem>
}