import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { LoadStatus } from "../../app/types";
import { createAsyncThunk } from '@reduxjs/toolkit';
import postHubRequest from "../../components/core/HubApi"
import { useAsyncHubLoad } from "../../app/hooks";

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
        return await postHubRequest({label: "requestLoginStatus"}, toHubPort)        
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
    extraReducers: builder => {
        builder.addCase(loadLoginState.pending, (state) => {
            state.isLoggedInLoadState = LoadStatus.Pending
        })
        .addCase(loadLoginState.rejected, (state) => {
            state.isLoggedInLoadState = LoadStatus.Failed
        })
        .addCase(loadLoginState.fulfilled, (state, action) => {
            state.isLoggedInLoadState = LoadStatus.Loaded
            state.isLoggedIn = action.payload
        })
    },
})

export const selectIsLoggedIn = (state: RootState) => state.profile.isLoggedIn
export const selectIsLoggedInStatus = (state: RootState) => state.profile.isLoggedInLoadState

export const useLoginHubLoad = () => useAsyncHubLoad(loadLoginState, selectIsLoggedIn, selectIsLoggedInStatus)  

export default profileSlice.reducer