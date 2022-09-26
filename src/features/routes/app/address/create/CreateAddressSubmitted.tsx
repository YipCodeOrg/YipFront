import { List, ListItem } from "@chakra-ui/react"
import { AiFillClockCircle } from "react-icons/ai"
import { PageWithHeading } from "../../../../../components/hoc/PageWithHeading"
import { CreateAddressData } from "../../../../../packages/YipStackLib/types/address/address"

export type CreateAddressSubmittedProps = {
    data: CreateAddressData | null
}

export function CreateAddressSubmitted(props: CreateAddressSubmittedProps) {

    const { data } = props

    if(data === null){
        return <CreateAddressSubmittedNullData/>
    }

    const address = data.address
    const addressLines = address.addressLines
    const name = data.name
    const heading = name === undefined ? "Creating Address... " : `Creating Address: ${name}...`

    return <PageWithHeading {...{heading}} icon={AiFillClockCircle}>
        <List boxShadow='outline' borderRadius="lg" p={2}>
            {addressLines.map(l => <ListItem>{l}</ListItem>)}
        </List>
    </PageWithHeading>
}

function CreateAddressSubmittedNullData(){
    return <>ERROR: Could not get submitted data</>
}