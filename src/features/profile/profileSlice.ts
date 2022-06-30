import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { LoadState } from "../../app/types";

type ProfileSliceState = {
    isLoggedIn: boolean,
    isLoggedInLoadState: LoadState
}

const initialState: ProfileSliceState = {
    isLoggedIn: false,
    isLoggedInLoadState: LoadState.NotLoaded
}

export const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setIsLoggedIn: (state: ProfileSliceState, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload
        }
    }
})

export const { setIsLoggedIn } = profileSlice.actions

export const selectIsLoggedIn = (state: RootState) => state.profile.isLoggedIn
export const selectIsLoggedInLoadState = (state: RootState) => state.profile.isLoggedInLoadState

export default profileSlice.reducer