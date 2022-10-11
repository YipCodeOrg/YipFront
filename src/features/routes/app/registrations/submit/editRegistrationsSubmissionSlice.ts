import { Registration } from "../../../../../packages/YipStackLib/types/registrations"
import { SubmissionState } from "../../../../../util/redux/slices/submissionSlice"

// TODO: Some sort of version number should be added for optimistic locking
export type EditRegistrationsData = {
    yipCode: string,
    registrations: Registration[]
}

export type CreateAddressSubmissionState = SubmissionState<EditRegistrationsData, EditRegistrationsData>