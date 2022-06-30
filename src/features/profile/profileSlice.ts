import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { LoadState } from "../../app/types";
import { createAsyncThunk } from '@reduxjs/toolkit';
import postHubRequest from "../../components/core/HubApi"

type ProfileSliceState = {
    isLoggedIn: boolean,
    isLoggedInLoadState: LoadState
}

const initialState: ProfileSliceState = {
    isLoggedIn: false,
    isLoggedInLoadState: LoadState.NotLoaded
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
            state.isLoggedInLoadState = LoadState.Pending
        })
        .addCase(loadLoginState.rejected, (state) => {
            state.isLoggedInLoadState = LoadState.Failed
        })
        .addCase(loadLoginState.fulfilled, (state, action) => {
            state.isLoggedInLoadState = LoadState.Loaded
            state.isLoggedIn = action.payload
        })
    },
})

export const selectIsLoggedIn = (state: RootState) => state.profile.isLoggedIn
export const selectIsLoggedInLoadState = (state: RootState) => state.profile.isLoggedInLoadState

export default profileSlice.reducer