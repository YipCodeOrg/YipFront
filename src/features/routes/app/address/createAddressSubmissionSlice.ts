import { createSlice } from "@reduxjs/toolkit"
import { AddressItem, CreateAddressData } from "../../../../packages/YipStackLib/types/address/address"

enum SubmissionStatus{
    Clear,
    Submitted,
    Success,
    Failure
}

type SubmissionSlice<TSubmit, TResponse> = {
    submitted: TSubmit | null,
    response: TResponse | null,
    status: SubmissionStatus
}

function newClearSubmissionSlice<TSubmit, TResponse>() : SubmissionSlice<TSubmit, TResponse>{
    return {
        submitted: null,
        response: null,
        status: SubmissionStatus.Clear
    }
}

type CreateAddressSubmissionSlice = SubmissionSlice<CreateAddressData, AddressItem>

const initialState: CreateAddressSubmissionSlice = newClearSubmissionSlice()

// TODO: Parameterise this on a backend
export function buildCreateAddressSubmissionSlice(){
    return createSlice({
        name: "createAddress/submission",
        initialState,
        reducers: {}
    })
}