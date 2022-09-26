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

    const addressLines = data.address.addressLines

    return <PageWithHeading heading="Creating Address... " icon={AiFillClockCircle}>
        <List boxShadow='outline' borderRadius="lg" p={2}>
            {addressLines.map(l => <ListItem>{l}</ListItem>)}
        </List>
    </PageWithHeading>
}

function CreateAddressSubmittedNullData(){
    return <>ERROR: Could not get submitted data</>
}