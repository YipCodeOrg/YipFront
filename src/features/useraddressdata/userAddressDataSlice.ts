import { AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { useAsyncHubLoad } from "../../app/hooks";
import { isUserAddressDataArray, UserAddressData } from "../../packages/YipStackLib/types/userAddressData";
import { createApiGetThunk, createStandardSlice } from "../../util/slices";
import { useUserDataHubLoad } from "../userdata/userDataSlice";
import { getLowestLoadStatus, LoadStatus } from "../../app/types";
import { inverseDataMap, sortByKeyFunction } from "../../packages/YipStackLib/util/misc";
import { useMemo } from "react";
import { UserData } from "../../packages/YipStackLib/types/userData";

export const loadUserAddressData: AsyncThunk<UserAddressData[], MessagePort, {}> = createApiGetThunk(
    "userAddressData/load", "/addresses", isUserAddressDataArray)

export const userAddressDataSlice = createStandardSlice("userAddressData", loadUserAddressData, d => d)

export const selectUserAddressData = (state: RootState) => state.userAddressData.sliceData
export const selectUserAddressDataStatus = (state: RootState) => state.userAddressData.loadStatus

export const useUserAddressDataHubLoad: () => [UserAddressData[] | undefined, LoadStatus] =
    () => useAsyncHubLoad(loadUserAddressData, selectUserAddressData, selectUserAddressDataStatus)  

export const useSortedAddressDataHubLoad: () => [UserAddressData[] | undefined, LoadStatus] = () => {
    const [userAddressData, userAddressDataStatus] = useUserAddressDataHubLoad()
    const [userData, userDataStatus] = useUserDataHubLoad()

    const status = getLowestLoadStatus(userAddressDataStatus, [userDataStatus])
    let sortedDataOrUndefined: UserAddressData[] | undefined = undefined
    
    sortedDataOrUndefined = useMemo(() => 
        sortUserAddressDataByYipCodes(userAddressData, userData), [userAddressData, userData])

    return [sortedDataOrUndefined, status]
}

export const useYipCodeToUserAddressMap: () => [Map<string, UserAddressData>, LoadStatus]
    = () => {
    const [userAddressData, userAddressDataStatus] = useUserAddressDataHubLoad()
    const map = useMemoisedYipCodeToAddressMap(userAddressData)
    return [map, userAddressDataStatus]
}

export function useMemoisedYipCodeToAddressMap
(userAddressData: UserAddressData[] | undefined): Map<string, UserAddressData>{
    const map = useMemo(() => getYipCodeToUserAddressMap(userAddressData), [userAddressData])
    return map
}

export function getYipCodeToUserAddressMap(userAddressData: UserAddressData[] | undefined)
: Map<string, UserAddressData>{
    if(!userAddressData){
        return new Map<string, UserAddressData>() 
    } 
    const map: Map<string, UserAddressData> = inverseDataMap(userAddressData, a => a.yipCode)
    return map
}

function sortUserAddressDataByYipCodes(userAddressData: UserAddressData[] | undefined,
        userData: UserData | undefined) : UserAddressData[] | undefined{
    if(!!userAddressData && !!userData){
        const yipCodes = userData.data.yipCodes
        return sortByKeyFunction(yipCodes, userAddressData, (data: UserAddressData) => data.yipCode)
    }
    return undefined
}

export default userAddressDataSlice.reducer