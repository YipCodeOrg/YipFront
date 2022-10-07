import { AiFillClockCircle } from "react-icons/ai"
import { Friend } from "../../../../../../packages/YipStackLib/types/friends/friend"
import { AddFriendSubmissionState } from "./AddFriendSubmissionState"

export type AddFriendSubmittedProps = {
    friend: Friend | null
}

export function AddFriendSubmitted(props: AddFriendSubmittedProps) {

    const { friend } = props

    function makeHeading(f: Friend){
        const name = f.name
        return `Adding Friend: ${name}...`
    }        

    return <AddFriendSubmissionState {...{friend, makeHeading, icon: AiFillClockCircle}}/>
}