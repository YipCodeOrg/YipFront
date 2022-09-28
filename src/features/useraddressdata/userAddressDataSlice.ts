import { AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { useAsyncHubFetch } from "../../app/hooks";
import { isUserAddressDataArray, UserAddressData } from "../../packages/YipStackLib/types/address/address";
import { fetchSliceGenerator, FetchSliceOf } from "../../util/redux/slices/fetchSlice";
import { createApiDeleteThunk, createApiGetThunk, PortBodyThunkInput } from "../../util/redux/thunks";
import { useUserDataHubFetch } from "../userdata/userDataSlice";
import { getLowestLoadStatus, LoadStatus } from "../../app/types";
import { useMemo } from "react";
import { UserData } from "../../packages/YipStackLib/types/userData";
import { inverseDataMap, sortByKeyFunction } from "../../packages/YipStackLib/packages/YipAddress/util/arrayUtil";
import { isString } from "../../packages/YipStackLib/packages/YipAddress/util/typePredicates";

export type FetchUserAddressDataThunk = AsyncThunk<UserAddressData[], MessagePort, {}>
export type FetchUserDataThunk = AsyncThunk<UserData, MessagePort, {}>

export type DeleteAddressData = {
    yipCode: string
}

export function isDeleteAddressData(obj: any): obj is DeleteAddressData{
    return isString(obj.yipCode)
}

export type DeleteAddressThunk = AsyncThunk<DeleteAddressData, PortBodyThunkInput<DeleteAddressData>, {}>

export const deleteAddress: DeleteAddressThunk = createApiDeleteThunk(
    "/address", isDeleteAddressData)

export const fetchUserAddressData: FetchUserAddressDataThunk = createApiGetThunk(
    "/addresses", isUserAddressDataArray)

export const userAddressDataSliceGenerator = fetchSliceGenerator<UserAddressData[]>("userAddressData", d => d)

export const userAddressDataSlice = userAddressDataSliceGenerator(fetchUserAddressData)

export const selectUserAddressDataSlice = (state: RootState) => state.userAddressData
export const selectUserAddressData = (state: RootState) => state.userAddressData.sliceData
export const selectUserAddressDataStatus = (state: RootState) => state.userAddressData.loadStatus

export function useUserAddressDataHubFetch(thunk: FetchUserAddressDataThunk)
: FetchSliceOf<UserAddressData[]>{
    return useAsyncHubFetch(thunk, selectUserAddressDataSlice)  
}    

export function useSortedAddressDataHubFetch(userAddressDataThunk: FetchUserAddressDataThunk,
    userDataThunk: FetchUserDataThunk): [UserAddressData[] | undefined, LoadStatus]{
    const { sliceData: userAddressData, loadStatus: userAddressDataStatus } = useUserAddressDataHubFetch(userAddressDataThunk)
    const { sliceData: userData, loadStatus: userDataStatus} = useUserDataHubFetch(userDataThunk)

    const status = getLowestLoadStatus(userAddressDataStatus, [userDataStatus])
    let sortedDataOrUndefined: UserAddressData[] | undefined = undefined
    
    sortedDataOrUndefined = useMemo(() => 
        sortUserAddressDataByYipCodes(userAddressData, userData), [userAddressData, userData])

    return [sortedDataOrUndefined, status]
}

export function useYipCodeToUserAddressMap(thunk: FetchUserAddressDataThunk)
:[Map<string, UserAddressData>, LoadStatus]{
    const { sliceData: userAddressData, loadStatus: userAddressDataStatus} = useUserAddressDataHubFetch(thunk)
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