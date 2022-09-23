import { AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { useAsyncHubFetch } from "../../app/hooks";
import { isUserData, UserData } from "../../packages/YipStackLib/types/userData";
import { fetchSliceGenerator } from "../../util/redux/slices/fetchSlice";
import { createApiGetThunk } from "../../util/redux/thunks";

export const fetchUserData: AsyncThunk<UserData, MessagePort, {}> = createApiGetThunk("/userdata", isUserData)

export const userDataSliceGenerator = fetchSliceGenerator<UserData>("userData", d => d)

export const userDataSlice = userDataSliceGenerator(fetchUserData)

export const selectUserDataSlice = (state: RootState) => state.userData
export const selectUserData = (state: RootState) => selectUserDataSlice(state).sliceData
export const selectUserDataStatus = (state: RootState) => selectUserDataSlice(state).loadStatus

export const selectYipCodes = (state: RootState) => selectUserData(state)?.data.yipCodes

export const useUserDataHubFetch = (thunk: AsyncThunk<UserData, MessagePort, {}>) => useAsyncHubFetch(thunk, selectUserDataSlice)  

export default userDataSlice.reducer