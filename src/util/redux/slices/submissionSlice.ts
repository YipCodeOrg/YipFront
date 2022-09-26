import { ActionReducerMapBuilder, createSlice, Draft } from "@reduxjs/toolkit"
import { PortBodyThunk } from "../thunks"

export enum SubmissionStatus{
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

function newClearSubmissionState<TSubmit, TResponse>() : SubmissionState<TSubmit, TResponse>{
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

export function submissionSliceGenerator<TSubmit, TResponse>(objectType: string,
    responseCastFunction: (t: TResponse) => Draft<TResponse>,
    submittedCastFunction: (t: TSubmit) => Draft<TSubmit> ){
    return (submissionThunk: PortBodyThunk<TSubmit, TResponse>) => {
        return createSlice({
            name: `${objectType}/submit`,
            initialState: newClearSubmissionState<TSubmit, TResponse>(),
            reducers: {
                clearState(state: Draft<SubmissionState<TSubmit, TResponse>>){
                    state.response = null
                    state.submitted = null
                    state.status = SubmissionStatus.Clear
                },
            },
            extraReducers: submissionThunkReducersGenerator(submissionThunk,
                responseCastFunction, submittedCastFunction)
        })
    }
}

function submissionThunkReducersGenerator<TSubmit, TResponse>(submissionThunk: PortBodyThunk<TSubmit, TResponse>, responseCastFunction: (t: TResponse) => Draft<TResponse>, submittedCastFunction: (t: TSubmit) => Draft<TSubmit>){
    return function(builder: ActionReducerMapBuilder<SubmissionState<TSubmit, TResponse>>){
        builder.addCase(submissionThunk.pending, (state, action) => {
            if(isClear(state)){
                state.status = SubmissionStatus.Submitted
                const submittedValue = action.meta.arg.body
                state.submitted = submittedCastFunction(submittedValue)
            } else {
                throw new Error("Unexpected pending status encountered - not in a clear state");            
            }
        })
        .addCase(submissionThunk.rejected, (state) => {
            state.status = SubmissionStatus.Failed
        })
        .addCase(submissionThunk.fulfilled, (state, action) => {
            if(isSubmitted(state)){
                state.status = SubmissionStatus.Responded
                state.response = responseCastFunction(action.payload)
            } else {
                throw new Error("Unexpected loaded status encountered - not in a submitted state.");            
            }
        })
        return builder
    }
}