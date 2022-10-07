import { Button, ButtonGroup, Tooltip, useColorModeValue } from "@chakra-ui/react"
import { MdCloudDone } from "react-icons/md"
import { Link } from "react-router-dom"
import { viewfriendsAbs } from "../../../../../../components/routing/routeStrings"
import { Friend } from "../../../../../../packages/YipStackLib/types/friends/friend"
import { AddFriendSubmissionState } from "./AddFriendSubmissionState"

export type AddFriendSuccessProps = {
    friend: Friend | null,
    clearSubmissionState: () => void
}

export function AddFriendSuccess(props: AddFriendSuccessProps) {

    const { friend, clearSubmissionState } = props

    const buttonBg = useColorModeValue('gray.50', 'gray.900')
    const addAnotherTooltip = "Add another friend"

    function makeHeading(f: Friend){
        const name = f.name
        return `Friend Added: ${name}   `
    }        

    return <AddFriendSubmissionState {...{friend, makeHeading, icon: MdCloudDone}}>
        <ButtonGroup>
            <Tooltip label={addAnotherTooltip}>
                <Button onClick={clearSubmissionState} bg={buttonBg}>
                    Add Another
                </Button>
            </Tooltip>
            <Link to={viewfriendsAbs}>
                <Button bg={buttonBg}>
                    View Friends
                </Button>
            </Link>
        </ButtonGroup>
    </AddFriendSubmissionState>
}