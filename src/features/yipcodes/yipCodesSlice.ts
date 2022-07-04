import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { LoadStatus } from "../../app/types";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useAsyncHubLoad } from "../../app/hooks";
import { addStandardThunkReducers } from "../../util/reduxHelpers";
import { sendApiRequest } from "../../components/core/HubApi";

type YipCodesSliceState = {
    yipCodes: string[],
    yipCodesLoadStatus: LoadStatus
}

const initialState: YipCodesSliceState = {
    yipCodes: [],
    yipCodesLoadStatus: LoadStatus.NotLoaded
}

type YipCodesResponse = {yipCodes: string[]}

function isYipCodesResponse(obj: any): obj is YipCodesResponse{
    if("yipCodes" in obj) {
        return isArrayOfStrings(obj.yipCodes)
    }
    return false
}

//Non-MVP: Move to some util place
function isArrayOfStrings(value: any): boolean {
    return Array.isArray(value) && value.every(item => typeof item === "string");
}

export const loadYipCodes = createAsyncThunk(
    "yipcodes/load", 
    async (toHubPort: MessagePort) => {
        const yipCodes = await sendApiRequest({method: "GET", path: "/yipcodes"}, toHubPort)
        .then(res => {
            const body = res.body
            if(!!body){
                return body
            }
            return Promise.reject("No body in response")         
        })
        .then(body => {
            const obj = JSON.parse(body)
            if(isYipCodesResponse(obj)){
                return obj.yipCodes
            }
            return Promise.reject("Bad response")
        })
        return yipCodes
    }
)

export const yipCodesSlice = createSlice({
    name: "yipCodes",
    initialState,
    reducers: {},
    extraReducers: addStandardThunkReducers(
        (state, payload) => state.yipCodesLoadStatus = payload,
        (state, status) => state.yipCodes = status,
        loadYipCodes),
})

export const selectYipCodes = (state: RootState) => state.yipCodes.yipCodes
export const selectYipCodesStatus = (state: RootState) => state.yipCodes.yipCodesLoadStatus

export const useYipCodesHubLoad = () => useAsyncHubLoad(loadYipCodes, selectYipCodes, selectYipCodesStatus)  

export default yipCodesSlice.reducer