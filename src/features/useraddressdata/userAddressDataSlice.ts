import { AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useAsyncHubLoad } from "../../app/hooks";
import { isUserAddressData, UserAddressData } from "../../packages/YipStackLib/types/userAddressData";
import { createApiGetThunk, createStandardSlice } from "../../util/slices";

export const loadUserAddressData: AsyncThunk<UserAddressData, MessagePort, {}> = createApiGetThunk(
    "userAddressData/load", "/addresses", isUserAddressData)

export const userAddressDataSlice = createStandardSlice("userAddressData", loadUserAddressData, d => d)

export const selectUserAddressData = (state: RootState) => state.userAddressData.sliceData
export const selectUserAddressDataStatus = (state: RootState) => state.userAddressData.loadStatus

export const useUserAddressDataHubLoad = () => useAsyncHubLoad(loadUserAddressData, selectUserAddressData, selectUserAddressDataStatus)  

export default userAddressDataSlice.reducer