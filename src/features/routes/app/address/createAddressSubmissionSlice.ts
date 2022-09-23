import { AddressItem, CreateAddressData } from "../../../../packages/YipStackLib/types/address/address"
import { submissionSliceGenerator, SubmissionState } from "../../../../util/redux/slices/submissionSlice"

export type CreateAddressSubmissionState = SubmissionState<CreateAddressData, AddressItem>

export const createAddressSubmissionSliceGenerator = 
    submissionSliceGenerator<CreateAddressData, AddressItem>("createAddress", a => a)
