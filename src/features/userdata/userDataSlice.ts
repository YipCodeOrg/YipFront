import { AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { useAsyncHubFetch } from "../../app/hooks";
import { isUserData, UserData } from "../../packages/YipStackLib/types/userData";
import { fetchSliceGenerator } from "../../util/redux/slices/fetchSlice";
import { createSimpleApiGetThunk } from "../../util/redux/thunks";

export const userDataSliceGenerator = fetchSliceGenerator<UserData, UserData>("userData", d => d, "/userdata", isUserData)

export const { slice: userDataSlice, thunk: fetchUserData } = userDataSliceGenerator(createSimpleApiGetThunk)

export const selectUserDataSlice = (state: RootState) => state.userData
export const selectUserData = (state: RootState) => selectUserDataSlice(state).sliceData
export const selectUserDataStatus = (state: RootState) => selectUserDataSlice(state).loadStatus

export const selectYipCodes = (state: RootState) => selectUserData(state)?.data.yipCodes

export const useUserDataHubFetch = (thunk: AsyncThunk<UserData, MessagePort, {}>) => useAsyncHubFetch(thunk, selectUserDataSlice)  

export default userDataSlice.reducer