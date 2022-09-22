import { AsyncThunk, createSlice, Draft } from "@reduxjs/toolkit"
import { LoadStatus } from "../../../app/types"
import { addStandardThunkReducers } from "../reduxHelpers"


export type ThunkSubmission<T> = {
    payload: T,
    port: MessagePort
}

enum SubmissionStatus{
    Clear,
    Submitted,
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

export function submissionSliceGenerator<TSubmit extends string, TResponse>(name: string,    
    boilerplateResponseCastFunction: (t: TResponse) => Draft<TResponse>){
    return (submissionThunk: AsyncThunk<TResponse, ThunkSubmission<TSubmit>, {}>) => {
        return createSlice({
            name,
            initialState: newClearSubmissionSlice<TSubmit, TResponse>(),
            reducers: {},
            extraReducers: addStandardThunkReducers<SubmissionState<TSubmit, TResponse>, ThunkSubmission<TSubmit>, TResponse>(
                handleThunkStatus,
                (state, payload) => state.response = boilerplateResponseCastFunction(payload),
                submissionThunk),
        })
    }
}

function handleThunkStatus<TSubmit, TResponse>(state: SubmissionState<TSubmit, TResponse>, loadStatus: LoadStatus){
    if(loadStatus === LoadStatus.Pending){
        if(isClear(state)){
            state.status = SubmissionStatus.Submitted
        } else {
            throw new Error("Unexpected pending status encountered - not in a clear state");            
        }
    } else if (loadStatus === LoadStatus.Failed) {
        state.status = SubmissionStatus.Failed
    } else if (loadStatus === LoadStatus.Loaded) {
        if(isSubmitted(state)){
            state.status = SubmissionStatus.Responded
        } else {
            throw new Error("Unexpected loaded status encountered - not in a submitted state");            
        }
    }
}