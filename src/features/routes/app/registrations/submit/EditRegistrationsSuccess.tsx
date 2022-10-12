import { Button, ButtonGroup, Tooltip, useColorModeValue } from "@chakra-ui/react"
import { MdCloudDone } from "react-icons/md"
import { Link } from "react-router-dom"
import { viewAddressesAbs } from "../../../../../components/routing/routeStrings"
import { EditRegistrationsSubmissionState } from "./EditRegistrationsSubmissionState"

export type EditRegistrationsSuccessProps = {
    yipCode: string | null,
    clearSubmissionState: () => void
}

export function EditRegistrationsSuccess(props: EditRegistrationsSuccessProps){

    const { yipCode, clearSubmissionState } = props

    const buttonBg = useColorModeValue('gray.50', 'gray.900')
    const editFurtherTooltip = "Make more edits"

    function makeHeading(yipCode: string){
        return `Registrations Edited: ${yipCode}   `
    }        

    return <EditRegistrationsSubmissionState {...{yipCode, makeHeading, icon: MdCloudDone}}>
        <ButtonGroup>
            <Tooltip label={editFurtherTooltip}>
                <Button onClick={clearSubmissionState} bg={buttonBg}>
                    More Edits
                </Button>
            </Tooltip>
            <Link to={viewAddressesAbs}>
                <Button bg={buttonBg}>
                    View Addresses
                </Button>
            </Link>
        </ButtonGroup>
    </EditRegistrationsSubmissionState>
}