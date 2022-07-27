import { AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useAsyncHubLoad } from "../../app/hooks";
import { HttpStatusOk, sendApiRequest } from "../../util/hubApi";
import { logAndReturnRejectedPromise } from "../../packages/YipStackLib/util/misc";
import { isUserData, UserData } from "../../packages/YipStackLib/types/userData";
import { createStandardSlice } from "../../util/slices";

export const loadUserData: AsyncThunk<UserData, MessagePort, {}> = createAsyncThunk(
    "userdata/load", 
    async (toHubPort: MessagePort) => {
        const userData = await sendApiRequest({method: "GET", path: "/userdata"}, toHubPort)
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
            if(isUserData(obj)){
                return obj
            }
            return logAndReturnRejectedPromise("Bad response")
        })
        return userData
    }
)

export const userDataSlice = createStandardSlice("userData", loadUserData, d => d)

export const selectUserData = (state: RootState) => state.userData.sliceData
export const selectUserDataStatus = (state: RootState) => state.userData.loadStatus

export const selectYipCodes = (state: RootState) => selectUserData(state)?.data.yipCodes

export const useUserDataHubLoad = () => useAsyncHubLoad(loadUserData, selectUserData, selectUserDataStatus)  

export default userDataSlice.reducer