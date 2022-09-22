import { AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { useAsyncHubFetch } from "../../app/hooks";
import { isUserAddressDataArray, UserAddressData } from "../../packages/YipStackLib/types/address/address";
import { createFetchSlice } from "../../util/redux/slices";
import { createApiGetThunk } from "../../util/redux/thunks";
import { useUserDataHubFetch } from "../userdata/userDataSlice";
import { getLowestLoadStatus, LoadStatus } from "../../app/types";
import { useMemo } from "react";
import { UserData } from "../../packages/YipStackLib/types/userData";
import { inverseDataMap, sortByKeyFunction } from "../../packages/YipStackLib/packages/YipAddress/util/arrayUtil";

export const fetchUserAddressData: AsyncThunk<UserAddressData[], MessagePort, {}> = createApiGetThunk(
    "/addresses", isUserAddressDataArray)

export const userAddressDataSliceGenerator = createFetchSlice<UserAddressData[]>("userAddressData", d => d)

export const userAddressDataSlice = userAddressDataSliceGenerator(fetchUserAddressData)

export const selectUserAddressData = (state: RootState) => state.userAddressData.sliceData
export const selectUserAddressDataStatus = (state: RootState) => state.userAddressData.loadStatus

export function useUserAddressDataHubFetch(thunk: AsyncThunk<UserAddressData[], MessagePort, {}>)
: [UserAddressData[] | undefined, LoadStatus]{
    return useAsyncHubFetch(thunk, selectUserAddressData, selectUserAddressDataStatus)  
}    

export function useSortedAddressDataHubFetch(userAddressDataThunk: AsyncThunk<UserAddressData[], MessagePort, {}>,
    userDataThunk: AsyncThunk<UserData, MessagePort, {}>): [UserAddressData[] | undefined, LoadStatus]{
    const [userAddressData, userAddressDataStatus] = useUserAddressDataHubFetch(userAddressDataThunk)
    const [userData, userDataStatus] = useUserDataHubFetch(userDataThunk)

    const status = getLowestLoadStatus(userAddressDataStatus, [userDataStatus])
    let sortedDataOrUndefined: UserAddressData[] | undefined = undefined
    
    sortedDataOrUndefined = useMemo(() => 
        sortUserAddressDataByYipCodes(userAddressData, userData), [userAddressData, userData])

    return [sortedDataOrUndefined, status]
}

export function useYipCodeToUserAddressMap(thunk: AsyncThunk<UserAddressData[], MessagePort, {}>)
:[Map<string, UserAddressData>, LoadStatus]{
    const [userAddressData, userAddressDataStatus] = useUserAddressDataHubFetch(thunk)
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
    const map: Map<string, UserAddressData> = inverseDataMap(userAddressData, a => a.address.yipCode)
    return map
}

function sortUserAddressDataByYipCodes(userAddressData: UserAddressData[] | undefined,
        userData: UserData | undefined) : UserAddressData[] | undefined{
    if(!!userAddressData && !!userData){
        const yipCodes = userData.data.yipCodes
        return sortByKeyFunction(yipCodes, userAddressData, (data: UserAddressData) => data.address.yipCode)
    }
    return undefined
}

export default userAddressDataSlice.reducer