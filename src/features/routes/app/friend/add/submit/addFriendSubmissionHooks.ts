import { useActionWithoutPayload, useAppSelector, useSubmissionRetry, useSubmissionThunkDispatch } from "../../../../../../app/hooks"
import { selectAddFriendSubmissionSlice } from "./addFriendSubmissionSelectors"
import { AddFriendSubmissionThunk, clearState } from "./addFriendSubmissionSlice"

export const useClearAddFriendSubmission = () => useActionWithoutPayload(clearState)

export function useAddFriendSubmitRetry(thunk: AddFriendSubmissionThunk){
    const submit = useAddFriendHubSubmit(thunk, false)
    return useSubmissionRetry(useAddFriendSubmissionState, useClearAddFriendSubmission, submit)
}

export function useAddFriendSubmissionState(){
    return useAppSelector(selectAddFriendSubmissionSlice)
}

export const useAddFriendHubSubmit = (thunk: AddFriendSubmissionThunk, 
    shouldCheckClear: boolean=true) => useSubmissionThunkDispatch(thunk, selectAddFriendSubmissionSlice, shouldCheckClear)
