import { LoadStatus } from "../app/types"
import { addStandardThunkReducers } from "./reduxHelpers"
import { AsyncThunk, createAsyncThunk, createSlice, Draft } from "@reduxjs/toolkit";
import { HttpStatusOk, sendApiRequest } from "./hubApi";
import { logAndReturnRejectedPromise } from "../packages/YipStackLib/util/misc";

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
    return createAsyncThunk(
        typePrefix, 
        async (toHubPort: MessagePort) => {
            const processedResponse = await sendApiRequest({method: "GET", path: path}, toHubPort)
            .then(res => {
                if(res.status !== HttpStatusOk){
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
                if(isCorrectType(obj)){
                    return obj
                }
                return logAndReturnRejectedPromise("Bad response")
            })
            return processedResponse
        }
    )
    
}