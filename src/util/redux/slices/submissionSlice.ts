import { AsyncThunk, createSlice, Draft, PayloadAction } from "@reduxjs/toolkit"
import { LoadStatus } from "../../../app/types"
import { addStandardThunkReducers } from "../reduxHelpers"


export type ThunkSubmission<T> = {
    payload: T,
    port: MessagePort
}

enum SubmissionStatus{
    Clear,
    Submitted,
    Sent,
    Responded,
    Failed
}

export type SubmissionState<TSubmit, TResponse> = {
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

function isClear<TSubmit, TResponse>(s: SubmissionState<TSubmit, TResponse>){
    return s.status === SubmissionStatus.Clear && s.submitted === null && s.response === null
}

function isSubmitted<TSubmit, TResponse>(s: SubmissionState<TSubmit, TResponse>){
    return s.status === SubmissionStatus.Submitted && s.submitted !== null && s.response === null
}

function isSent<TSubmit, TResponse>(s: SubmissionState<TSubmit, TResponse>){
    return s.status === SubmissionStatus.Sent && s.submitted !== null && s.response === null
}

export function submissionSliceGenerator<TSubmit extends string, TResponse>(name: string,
    boilerplateSubmitCastFunction: (t: TSubmit) => Draft<TSubmit>,
    boilerplateResponseCastFunction: (t: TResponse) => Draft<TResponse>){
    return (submissionThunk: AsyncThunk<TResponse, ThunkSubmission<TSubmit>, {}>) => {
        return createSlice({
            name,
            initialState: newClearSubmissionSlice<TSubmit, TResponse>(),
            reducers: {
                submit(state: Draft<SubmissionState<TSubmit, TResponse>>, action: PayloadAction<TSubmit>){
                    if(!isClear(state)){
                        throw new Error("Cannot submit data - submission state is not clear");
                        
                    }
                    state.submitted = boilerplateSubmitCastFunction(action.payload)

                    //TODO: Kick off the thunk here
                },
            },
            extraReducers: addStandardThunkReducers<SubmissionState<TSubmit, TResponse>, ThunkSubmission<TSubmit>, TResponse>(
                handleThunkStatus,
                (state, payload) => state.response = boilerplateResponseCastFunction(payload),
                submissionThunk),
        })
    }
}

function handleThunkStatus<TSubmit, TResponse>(state: SubmissionState<TSubmit, TResponse>, loadStatus: LoadStatus){
    if(loadStatus === LoadStatus.Pending){
        if(isSubmitted(state)){
            state.status = SubmissionStatus.Sent
        } else {
            throw new Error("Unexpected pending status encountered - not in a submission state");            
        }
    } else if (loadStatus === LoadStatus.Failed) {
        state.status = SubmissionStatus.Failed
    } else if (loadStatus === LoadStatus.Loaded) {
        if(isSent(state)){
            state.status = SubmissionStatus.Submitted
        } else {
            throw new Error("Unexpected loaded status encountered - not in a sent state");            
        }
    }
}