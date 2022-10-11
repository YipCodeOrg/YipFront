import { isSimpleStringProperty } from "../../../../../packages/YipStackLib/packages/YipAddress/util/typePredicates"
import { isRegistrations, Registration } from "../../../../../packages/YipStackLib/types/registrations"
import { submissionSliceGenerator, SubmissionState } from "../../../../../util/redux/slices/submissionSlice"
import { createSimpleApiPutThunk, PortBodyThunk } from "../../../../../util/redux/thunks"

// TODO: Some sort of version number should be added for optimistic locking
export type EditRegistrationsData = {
    yipCode: string,
    registrations: Registration[]
}

export function isEditRegistrationsData(obj: any): obj is EditRegistrationsData{
    if(!obj){
        return false
    }
    if(!isSimpleStringProperty(obj, "yipCode")){
        return false
    }
    if(!isRegistrations(obj.registrations)){
        return false
    }
    return true
}

export type EditRegistrationsSubmissionState = SubmissionState<EditRegistrationsData, EditRegistrationsData>
export type EditRegistrationsSubmissionThunk = PortBodyThunk<EditRegistrationsData, EditRegistrationsData>

export const submitEditRegistrations: EditRegistrationsSubmissionThunk =
    createSimpleApiPutThunk<EditRegistrationsData, EditRegistrationsData>("/registrations", isEditRegistrationsData)

export const editRegistrationsSubmissionSliceGenerator = 
    submissionSliceGenerator<EditRegistrationsData, EditRegistrationsData>("editRegistrations",
        a => a, a => a)

export const editRegistrationsSubmissionSlice = editRegistrationsSubmissionSliceGenerator(submitEditRegistrations)

export const { clearState } = editRegistrationsSubmissionSlice.actions

export default editRegistrationsSubmissionSlice.reducer