import { Registration } from "../../../../../packages/YipStackLib/types/registrations"
import { SubmissionState } from "../../../../../util/redux/slices/submissionSlice"
import { PortBodyThunk } from "../../../../../util/redux/thunks"

// TODO: Some sort of version number should be added for optimistic locking
export type EditRegistrationsData = {
    yipCode: string,
    registrations: Registration[]
}

export type EditRegistrationsSubmissionState = SubmissionState<EditRegistrationsData, EditRegistrationsData>
export type EditRegistrationsSubmissionThunk = PortBodyThunk<EditRegistrationsData, EditRegistrationsData>