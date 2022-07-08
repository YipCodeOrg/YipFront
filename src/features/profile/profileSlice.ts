import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { LoadStatus } from "../../app/types";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendHubRequest } from "../../util/hubApi"
import { useAsyncHubLoad } from "../../app/hooks";
import { addStandardThunkReducers } from "../../util/reduxHelpers";

type ProfileSliceState = {
    isLoggedIn: boolean,
    isLoggedInLoadState: LoadStatus
}

const initialState: ProfileSliceState = {
    isLoggedIn: false,
    isLoggedInLoadState: LoadStatus.NotLoaded
}

export const loadLoginState = createAsyncThunk(
    "profile/loadLoginState",
    async (toHubPort: MessagePort) => {
        return await sendHubRequest({label: "requestLoginStatus"}, toHubPort)        
        .then(val => {
                const status = val.label
                console.log(`...Login status received from Hub: ${status}`);    
                const isLoggedIn = status === "userIsLoggedIn"
                return isLoggedIn
            }
        )
    }
)

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setIsLoggedIn: (state: ProfileSliceState, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload
        }
    },
    extraReducers: addStandardThunkReducers(
        (state, status) => state.isLoggedInLoadState = status,
        (state, payload) => state.isLoggedIn = payload,
        loadLoginState),
})

export const selectIsLoggedIn = (state: RootState) => state.profile.isLoggedIn
export const selectIsLoggedInStatus = (state: RootState) => state.profile.isLoggedInLoadState

export const useLoginHubLoad = () => useAsyncHubLoad(loadLoginState, selectIsLoggedIn, selectIsLoggedInStatus)  

export default profileSlice.reducer