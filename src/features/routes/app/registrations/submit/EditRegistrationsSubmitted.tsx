import { AiFillClockCircle } from "react-icons/ai"
import { EditRegistrationsSubmissionState } from "./EditRegistrationsSubmissionState"

export type EditRegistrationsSubmittedProps = {
    yipCode: string | null
}

export function EditRegistrationsSubmitted(props: EditRegistrationsSubmittedProps){

    const { yipCode } = props

    function makeHeading(yipCode: string){
        return `Updating registrations: ${yipCode}...`
    }        

    return <EditRegistrationsSubmissionState {...{yipCode, makeHeading, icon: AiFillClockCircle}}/>
}