import { AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { useAsyncHubLoad } from "../../app/hooks";
import { isUserData, UserData } from "../../packages/YipStackLib/types/userData";
import { createFetchSlice } from "../../util/redux/slices";
import { createApiGetThunk } from "../../util/redux/thunks";

export const fetchUserData: AsyncThunk<UserData, MessagePort, {}> = createApiGetThunk("/userdata", isUserData)

export const userDataSlice = createFetchSlice<UserData>("userData", d => d)(fetchUserData)

export const selectUserData = (state: RootState) => state.userData.sliceData
export const selectUserDataStatus = (state: RootState) => state.userData.loadStatus

export const selectYipCodes = (state: RootState) => selectUserData(state)?.data.yipCodes

export const useUserDataHubLoad = () => useAsyncHubLoad(fetchUserData, selectUserData, selectUserDataStatus)  

export default userDataSlice.reducer