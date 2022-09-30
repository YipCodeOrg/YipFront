import { AddressItem, CreateAddressData, isAddressItem } from "../../../../../../packages/YipStackLib/types/address/address"
import { submissionSliceGenerator, SubmissionState } from "../../../../../../util/redux/slices/submissionSlice"
import { createSimpleApiPostThunk, PortBodyThunk } from "../../../../../../util/redux/thunks"

export type CreateAddressSubmissionState = SubmissionState<CreateAddressData, AddressItem>
export type CreateAddressSubmissionThunk = PortBodyThunk<CreateAddressData, AddressItem>

export const submitCreateAddress: CreateAddressSubmissionThunk =
    createSimpleApiPostThunk<CreateAddressData, AddressItem>("/createAddressData", isAddressItem)

export const createAddressSubmissionSliceGenerator = 
    submissionSliceGenerator<CreateAddressData, AddressItem>("createAddress",
        a => a, a => a)

export const createAddressSubmissionSlice = createAddressSubmissionSliceGenerator(submitCreateAddress)

export const { clearState } = createAddressSubmissionSlice.actions

export default createAddressSubmissionSlice.reducer