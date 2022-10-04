import { Button, ButtonGroup, Tooltip, useColorModeValue } from "@chakra-ui/react"
import { MdCloudDone } from "react-icons/md"
import { Link } from "react-router-dom"
import { viewAddressesAbs } from "../../../../../../components/routing/routeStrings"
import { CreateAddressData } from "../../../../../../packages/YipStackLib/types/address/address"
import { CreateAddressSubmissionState } from "./CreateAddressSubmissionState"

export type CreateAddressSuccessProps = {
    data: CreateAddressData | null,
    clearSubmissionState: () => void
}

export function CreateAddressSuccess(props: CreateAddressSuccessProps) {

    const { data, clearSubmissionState } = props

    const buttonBg = useColorModeValue('gray.50', 'gray.900')
    const createAnotherTooltip = "Ceate another address"

    function makeHeading(data: CreateAddressData){
        const name = data.name
        return name === undefined ? "Address Created" : `Address Created: ${name}  `
    }        

    return <CreateAddressSubmissionState {...{data, makeHeading, icon: MdCloudDone}}>
        <ButtonGroup>
            <Tooltip label={createAnotherTooltip}>
                <Button onClick={clearSubmissionState} bg={buttonBg}>
                    Create Another
                </Button>
            </Tooltip>
            <Link to={viewAddressesAbs}>
                <Button bg={buttonBg}>
                    View Addresses
                </Button>
            </Link>
        </ButtonGroup>
    </CreateAddressSubmissionState>
}