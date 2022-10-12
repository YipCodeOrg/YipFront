import { useActionWithoutPayload, useAppSelector, useSubmissionRetry, useSubmissionThunkDispatch } from "../../../../../app/hooks"
import { selectEditRegistrationsSubmissionSlice } from "./editRegistrationsSubmissionSelectors"
import { clearState, EditRegistrationsSubmissionThunk } from "./editRegistrationsSubmissionSlice"

export const useClearEditRegistrationsSubmission = () => useActionWithoutPayload(clearState)

export function useEditRegistrationsSubmitRetry(thunk: EditRegistrationsSubmissionThunk){
    const submit = useEditRegistrationsHubSubmit(thunk, false)
    return useSubmissionRetry(useEditRegistrationsSubmissionState, useClearEditRegistrationsSubmission, submit)
}

export function useEditRegistrationsSubmissionState(){
    return useAppSelector(selectEditRegistrationsSubmissionSlice)
}

export const useEditRegistrationsHubSubmit = (thunk: EditRegistrationsSubmissionThunk, 
    shouldCheckClear:boolean=true) => useSubmissionThunkDispatch(thunk, selectEditRegistrationsSubmissionSlice, shouldCheckClear)