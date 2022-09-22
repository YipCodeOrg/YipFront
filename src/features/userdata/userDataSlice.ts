import { AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { useAsyncHubLoad } from "../../app/hooks";
import { isUserData, UserData } from "../../packages/YipStackLib/types/userData";
import { createFetchSlice } from "../../util/redux/slices";
import { createApiGetThunk } from "../../util/redux/thunks";

export const fetchUserData: AsyncThunk<UserData, MessagePort, {}> = createApiGetThunk("/userdata", isUserData)

export const userDataSliceGenerator = createFetchSlice<UserData>("userData", d => d)

export const userDataSlice = userDataSliceGenerator(fetchUserData)

export const selectUserData = (state: RootState) => state.userData.sliceData
export const selectUserDataStatus = (state: RootState) => state.userData.loadStatus

export const selectYipCodes = (state: RootState) => selectUserData(state)?.data.yipCodes

export const useUserDataHubLoad = (thunk: AsyncThunk<UserData, MessagePort, {}>) => useAsyncHubLoad(thunk, selectUserData, selectUserDataStatus)  

export default userDataSlice.reducer