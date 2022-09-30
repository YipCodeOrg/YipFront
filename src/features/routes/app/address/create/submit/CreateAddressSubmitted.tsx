import { AiFillClockCircle } from "react-icons/ai"
import { CreateAddressData } from "../../../../../../packages/YipStackLib/types/address/address"
import { CreateAddressSubmissionState } from "./CreateAddressSubmissionState"

export type CreateAddressSubmittedProps = {
    data: CreateAddressData | null
}

export function CreateAddressSubmitted(props: CreateAddressSubmittedProps) {

    const { data } = props

    function makeHeading(data: CreateAddressData){
        const name = data.name
        return name === undefined ? "Creating Address... " : `Creating Address: ${name}...`
    }        

    return <CreateAddressSubmissionState {...{data, makeHeading, icon: AiFillClockCircle}}>
    </CreateAddressSubmissionState>
}