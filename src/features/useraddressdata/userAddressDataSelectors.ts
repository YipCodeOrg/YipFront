import { RootState } from "../../app/store"

export const selectUserAddressDataSlice = (state: RootState) => state.userAddressData
export const selectUserAddressData = (state: RootState) => state.userAddressData.sliceData
export const selectUserAddressDataStatus = (state: RootState) => state.userAddressData.loadStatus
