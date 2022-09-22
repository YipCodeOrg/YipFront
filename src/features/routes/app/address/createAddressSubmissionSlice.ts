import { AddressItem, CreateAddressData } from "../../../../packages/YipStackLib/types/address/address"
import { SubmissionState } from "../../../../util/redux/slices/submissionSlice"

export type CreateAddressSubmissionState = SubmissionState<CreateAddressData, AddressItem>
