import { List, ListItem } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { PageWithHeading } from "../../../../../components/hoc/PageWithHeading"
import { CreateAddressData } from "../../../../../packages/YipStackLib/types/address/address"

export type CreateAddressSubmissionStateProps = {
    data: CreateAddressData | null,
    makeHeading: (d: CreateAddressData) => string,
    icon: IconType
}

export function CreateAddressSubmissionState(props: CreateAddressSubmissionStateProps) {

    const { data, makeHeading, icon } = props

    if(data === null){
        return <CreateAddressSubmissionStateNullData/>
    }

    const address = data.address
    const addressLines = address.addressLines
    const heading = makeHeading(data)

    return <PageWithHeading {...{heading}} icon={icon}>
        <List boxShadow='outline' borderRadius="lg" p={2}>
            {addressLines.map(l => <ListItem>{l}</ListItem>)}
        </List>
    </PageWithHeading>
}

function CreateAddressSubmissionStateNullData(){
    return <>ERROR: Could not get submitted data</>
}