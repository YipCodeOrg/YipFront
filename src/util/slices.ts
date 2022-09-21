import { LoadStatus } from "../app/types"
import { addStandardThunkReducers } from "./reduxHelpers"
import { AsyncThunk, createAsyncThunk, createSlice, Draft } from "@reduxjs/toolkit";
import { HttpStatusOk, sendApiRequest } from "./hubApi";
import { logAndReturnRejectedPromise } from "../packages/YipStackLib/util/misc";
import { ApiRequestPayload } from "../packages/YipStackLib/util/hubFront";

export type SliceOf<T> = {
    sliceData?: T,
    loadStatus: LoadStatus
}

export function initialSlice<T>(): SliceOf<T> {
    return {loadStatus: LoadStatus.NotLoaded}
}

export function createStandardSlice<T>(name: string, loadSlice: AsyncThunk<T, MessagePort, {}>,
    boilerplateCastFunction: (t: T) => Draft<T>){        
    return createSlice({
        name,
        initialState: initialSlice<T>(),
        reducers: {},
        extraReducers: addStandardThunkReducers<SliceOf<T>, T>(
            (state, status) => state.loadStatus = status,
            (state, payload) => state.sliceData = boilerplateCastFunction(payload),
            loadSlice),
    })
}

export function createApiGetThunk<T>(typePrefix: string, path: string, isCorrectType: (obj: any) => obj is T){
    const payload = {method: "GET", path: path}
    return createApiRequestThunk<MessagePort, T>(typePrefix, () => payload, p => p, isCorrectType, HttpStatusOk)    
}

function createApiRequestThunk<TThunkInput, TResponse>(typePrefix: string,
    requestGenerator: (i: TThunkInput) => ApiRequestPayload,
    getPort: (i: TThunkInput) => MessagePort,
    isResponseCorrectType: (obj: any) => obj is TResponse,
    expectedStatus: number){
    return createAsyncThunk(
        typePrefix, 
        async (input: TThunkInput) => {

            const request = requestGenerator(input)
            const toHubPort = getPort(input)

            const processedResponse = await sendApiRequest(request, toHubPort)
            .then(res => {
                if(res.status !== expectedStatus){
                    return logAndReturnRejectedPromise("Unexpected response status")
                }
                const body = res.body
                if(!!body){
                    return body
                } else{
                    return logAndReturnRejectedPromise("No body in response")         
                }            
            })
            .then(body => {
                const obj = JSON.parse(body)
                if(isResponseCorrectType(obj)){
                    return obj
                }
                return logAndReturnRejectedPromise("Response is not of the correct type")
            })
            return processedResponse
        }
    )    
}


