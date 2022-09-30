import { RootState } from "../../app/store"

export const selectUserDataSlice = (state: RootState) => state.userData
export const selectUserData = (state: RootState) => selectUserDataSlice(state).sliceData
export const selectUserDataStatus = (state: RootState) => selectUserDataSlice(state).loadStatus

export const selectYipCodes = (state: RootState) => selectUserData(state)?.data.yipCodes