import { MdError } from "react-icons/md"
import { CreateAddressData } from "../../../../../packages/YipStackLib/types/address/address"
import { CreateAddressSubmissionState } from "./CreateAddressSubmissionState"

export type CreateAddressFailedProps = {
    data: CreateAddressData | null
}

export function CreateAddressFailed(props: CreateAddressFailedProps) {

    const { data } = props

    function makeHeading(data: CreateAddressData){
        const name = data.name
        return name === undefined ? "Error Creating Adddress" : `Error Creating Adddress: ${name}  `
    }        

    return <CreateAddressSubmissionState {...{data, makeHeading, icon: MdError}}/>
}