import { useActionWithoutPayload, useAppSelector, useSubmissionRetry, useSubmissionThunkDispatch } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import { AddressItem, CreateAddressData, isAddressItem } from "../../../../../packages/YipStackLib/types/address/address"
import { submissionSliceGenerator, SubmissionState } from "../../../../../util/redux/slices/submissionSlice"
import { createApiPostThunk, PortBodyThunk } from "../../../../../util/redux/thunks"

export type CreateAddressSubmissionState = SubmissionState<CreateAddressData, AddressItem>
export type CreateAddressSubmissionThunk = PortBodyThunk<CreateAddressData, AddressItem>

export const submitCreateAddress: CreateAddressSubmissionThunk =
    createApiPostThunk<CreateAddressData, AddressItem>("/createAddressData", isAddressItem)

export const createAddressSubmissionSliceGenerator = 
    submissionSliceGenerator<CreateAddressData, AddressItem>("createAddress",
        a => a, a => a)

export const createAddressSubmissionSlice = createAddressSubmissionSliceGenerator(submitCreateAddress)

export const useClearCreateAddressSubmission = () => useActionWithoutPayload(createAddressSubmissionSlice.actions.clearState)

export function useCreateAddressSubmitRetry(thunk: CreateAddressSubmissionThunk){
    return useSubmissionRetry(useCreateAddressSubmissionState, useClearCreateAddressSubmission, () => useCreateAddressHubSubmit(thunk, false))
}

export const selectCreateAddressSubmissionSlice = (state: RootState) => state.createAddressSubmission

export const useCreateAddressSubmissionState = () => useAppSelector(selectCreateAddressSubmissionSlice)

export const useCreateAddressHubSubmit = (thunk: CreateAddressSubmissionThunk, 
    shouldCheckClear:boolean=true) => useSubmissionThunkDispatch(thunk, selectCreateAddressSubmissionSlice, shouldCheckClear)

export default createAddressSubmissionSlice.reducer