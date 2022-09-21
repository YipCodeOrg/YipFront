import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit"
import { AddressItem, CreateAddressData } from "../../../../packages/YipStackLib/types/address/address"

enum SubmissionStatus{
    Clear,
    Submitted,
    Sent,
    Responded,
    Failed
}

type SubmissionState<TSubmit, TResponse> = {
    submitted: TSubmit | null,
    response: TResponse | null,
    status: SubmissionStatus
}

function newClearSubmissionSlice<TSubmit, TResponse>() : SubmissionState<TSubmit, TResponse>{
    return {
        submitted: null,
        response: null,
        status: SubmissionStatus.Clear
    }
}

export type CreateAddressSubmissionState = SubmissionState<CreateAddressData, AddressItem>

function isClear<TSubmit, TResponse>(s: SubmissionState<TSubmit, TResponse>){
    return s.status === SubmissionStatus.Clear && s.submitted === null && s.status === null
}

// TODO: Parameterise this on a backend
export function buildSubmissionSlice<TSubmit extends string, TResponse>(name: string,
    boilerplateCastFunction: (t: TSubmit) => Draft<TSubmit>){
    return createSlice({
        name,
        initialState: newClearSubmissionSlice<TSubmit, TResponse>(),
        reducers: {
            submit(state: Draft<SubmissionState<TSubmit, TResponse>>, action: PayloadAction<TSubmit>){
                if(!isClear(state)){
                    throw new Error("Cannot submit data - submission state is not clear");
                    
                }
                state.submitted = boilerplateCastFunction(action.payload)
            },
        }
    })
}