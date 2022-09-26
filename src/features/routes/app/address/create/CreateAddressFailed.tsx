import { List, ListItem } from "@chakra-ui/react"
import { MdError } from "react-icons/md"
import { PageWithHeading } from "../../../../../components/hoc/PageWithHeading"
import { CreateAddressData } from "../../../../../packages/YipStackLib/types/address/address"

export type CreateAddressFailedProps = {
    data: CreateAddressData | null
}

export function CreateAddressFailed(props: CreateAddressFailedProps) {

    const { data } = props

    if(data === null){
        return <CreateAddressFailedNullData/>
    }

    const address = data.address
    const addressLines = address.addressLines
    const name = data.name
    const heading = name === undefined ? "Error Creating Adddress" : `Error Creating Adddress: ${name}  `

    return <PageWithHeading {...{heading}} icon={MdError}>
        <List boxShadow='outline' borderRadius="lg" p={2}>
            {addressLines.map(l => <ListItem>{l}</ListItem>)}
        </List>
    </PageWithHeading>
}

function CreateAddressFailedNullData(){
    return <>ERROR: Could not get submitted data</>
}