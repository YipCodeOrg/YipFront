import { Button, ButtonGroup, Tooltip, useColorModeValue } from "@chakra-ui/react"
import { MdCloudDone } from "react-icons/md"
import { CreateAddressData } from "../../../../../packages/YipStackLib/types/address/address"
import { CreateAddressSubmissionState } from "./CreateAddressSubmissionState"

export type CreateAddressSuccessProps = {
    data: CreateAddressData | null,
    clearSubmissionState: () => void
}

export function CreateAddressSuccess(props: CreateAddressSuccessProps) {

    const { data, clearSubmissionState } = props

    const buttonBg = useColorModeValue('gray.50', 'gray.900')
    const tooltip = "Ceate another address"

    function makeHeading(data: CreateAddressData){
        const name = data.name
        return name === undefined ? "Address Created" : `Address Created: ${name}  `
    }        

    return <CreateAddressSubmissionState {...{data, makeHeading, icon: MdCloudDone}}>
        <ButtonGroup>
            <Tooltip label={tooltip}>
                <Button onClick={clearSubmissionState} bg={buttonBg}>
                    Create Another
                </Button>
            </Tooltip>
        </ButtonGroup>
    </CreateAddressSubmissionState>
}