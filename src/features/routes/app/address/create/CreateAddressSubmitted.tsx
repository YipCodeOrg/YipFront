import { Text } from "@chakra-ui/react"
import { AiFillClockCircle } from "react-icons/ai"
import { PageWithHeading } from "../../../../../components/hoc/PageWithHeading"
import { printAddress } from "../../../../../packages/YipStackLib/packages/YipAddress/types/address/address"
import { CreateAddressData } from "../../../../../packages/YipStackLib/types/address/address"

export type CreateAddressSubmittedProps = {
    data: CreateAddressData | null
}

export function CreateAddressSubmitted(props: CreateAddressSubmittedProps) {

    const { data } = props

    if(data === null){
        return <CreateAddressSubmittedNullData/>
    }

    const submittedAddress = printAddress(data.address, "\n") ?? "Error getting address"

    return <PageWithHeading heading="Creating Address... " icon={AiFillClockCircle}>
        <Text>
            {submittedAddress}
        </Text>
    </PageWithHeading>
}

function CreateAddressSubmittedNullData(){
    return <>ERROR: Could not get submitted data</>
}