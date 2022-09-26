import { MdCloudDone } from "react-icons/md"
import { CreateAddressData } from "../../../../../packages/YipStackLib/types/address/address"
import { CreateAddressSubmissionState } from "./CreateAddressSubmissionState"

export type CreateAddressSuccessProps = {
    data: CreateAddressData | null
}

export function CreateAddressSuccess(props: CreateAddressSuccessProps) {

    const { data } = props

    function makeHeading(data: CreateAddressData){
        const name = data.name
        return name === undefined ? "Address Created" : `Address Created: ${name}  `
    }        

    return <CreateAddressSubmissionState {...{data, makeHeading, icon: MdCloudDone}}/>
}