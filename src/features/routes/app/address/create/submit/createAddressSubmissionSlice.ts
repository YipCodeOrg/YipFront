import { CreateAddressData, isUserAddressData, UserAddressData } from "../../../../../../packages/YipStackLib/types/address/address"
import { submissionSliceGenerator, SubmissionState } from "../../../../../../util/redux/slices/submissionSlice"
import { createSimpleApiPostThunk, PortBodyThunk } from "../../../../../../util/redux/thunks"

export type CreateAddressSubmissionState = SubmissionState<CreateAddressData, UserAddressData>
export type CreateAddressSubmissionThunk = PortBodyThunk<CreateAddressData, UserAddressData>

export const submitCreateAddress: CreateAddressSubmissionThunk =
    createSimpleApiPostThunk<CreateAddressData, UserAddressData>("/createAddressData", isUserAddressData)

export const createAddressSubmissionSliceGenerator = 
    submissionSliceGenerator<CreateAddressData, UserAddressData>("createAddress",
        a => a, a => a)

export const createAddressSubmissionSlice = createAddressSubmissionSliceGenerator(submitCreateAddress)

export const { clearState } = createAddressSubmissionSlice.actions

export default createAddressSubmissionSlice.reducer