import { RootState } from "../../app/store"


export const selectIsLoggedInSlice = (state: RootState) => state.profile
export const selectIsLoggedIn = (state: RootState) => state.profile.sliceData ?? false
export const selectIsLoggedInStatus = (state: RootState) => state.profile.loadStatus