import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadStatus } from "../../app/types";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { sendHubRequest } from "../../util/hubApi"
import { addFetchThunkReducers } from "../../util/redux/reduxHelpers";
import { FetchSliceOf } from "../../util/redux/slices/fetchSlice";

type ProfileSliceState = FetchSliceOf<boolean>

const initialState: ProfileSliceState = {
    sliceData: false,
    loadStatus: LoadStatus.NotLoaded
}

export const fetchLoginState = createAsyncThunk(
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
            state.sliceData = action.payload
        }
    },
    extraReducers: addFetchThunkReducers(
        (state, status) => state.loadStatus = status,
        (state, payload) => state.sliceData = payload,
        fetchLoginState),
})

export default profileSlice.reducer