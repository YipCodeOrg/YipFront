import { useActionWithoutPayload, useAppSelector, useSubmissionRetry, useSubmissionThunkDispatch } from "../../../../../../app/hooks"
import { selectCreateAddressSubmissionSlice } from "./createAddressSubmissionSelectors"
import { clearState, CreateAddressSubmissionThunk } from "./createAddressSubmissionSlice"

export const useClearCreateAddressSubmission = () => useActionWithoutPayload(clearState)

export function useCreateAddressSubmitRetry(thunk: CreateAddressSubmissionThunk){
    const submit = useCreateAddressHubSubmit(thunk, false)
    return useSubmissionRetry(useCreateAddressSubmissionState, useClearCreateAddressSubmission, submit)
}

export function useCreateAddressSubmissionState(){
    return useAppSelector(selectCreateAddressSubmissionSlice)
}

export const useCreateAddressHubSubmit = (thunk: CreateAddressSubmissionThunk, 
    shouldCheckClear:boolean=true) => useSubmissionThunkDispatch(thunk, selectCreateAddressSubmissionSlice, shouldCheckClear)
