import { AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { useAsyncHubLoad } from "../../app/hooks";
import { isUserData, UserData } from "../../packages/YipStackLib/types/userData";
import { createApiGetThunk, createStandardSlice } from "../../util/slices";

export const loadUserData: AsyncThunk<UserData, MessagePort, {}> = createApiGetThunk(
    "userdata/load", "/userdata", isUserData)

export const userDataSlice = createStandardSlice("userData", loadUserData, d => d)

export const selectUserData = (state: RootState) => state.userData.sliceData
export const selectUserDataStatus = (state: RootState) => state.userData.loadStatus

export const selectYipCodes = (state: RootState) => selectUserData(state)?.data.yipCodes

export const useUserDataHubLoad = () => useAsyncHubLoad(loadUserData, selectUserData, selectUserDataStatus)  

export default userDataSlice.reducer