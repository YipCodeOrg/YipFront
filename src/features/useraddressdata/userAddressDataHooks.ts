import { useAsyncHubFetch } from "../../app/hooks";
import { getLowestLoadStatus, LoadStatus } from "../../app/types";
import { useUserDataHubFetch } from "../userdata/userDataHooks";
import { useMemo } from "react";
import { inverseDataMap, sortByKeyFunction } from "../../packages/YipStackLib/packages/YipAddress/util/arrayUtil";
import { FetchUserAddressDataThunk, FetchUserDataThunk, UserAddressSliceData } from "./userAddressDataSlice";
import { FetchSliceOf } from "../../util/redux/slices/fetchSlice";
import { UserData } from "../../packages/YipStackLib/types/userData";
import { selectUserAddressDataSlice } from "./userAddressDataSelectors";

export function useUserAddressDataHubFetch(thunk: FetchUserAddressDataThunk)
: FetchSliceOf<UserAddressSliceData[]>{
    return useAsyncHubFetch(thunk, selectUserAddressDataSlice)  
}    

export function useSortedAddressDataHubFetch(userAddressDataThunk: FetchUserAddressDataThunk,
    userDataThunk: FetchUserDataThunk): [UserAddressSliceData[] | undefined, LoadStatus]{
    const { sliceData: userAddressData, loadStatus: userAddressDataStatus } = useUserAddressDataHubFetch(userAddressDataThunk)
    const { sliceData: userData, loadStatus: userDataStatus} = useUserDataHubFetch(userDataThunk)

    const status = getLowestLoadStatus(userAddressDataStatus, [userDataStatus])
    let sortedDataOrUndefined: UserAddressSliceData[] | undefined = undefined
    
    sortedDataOrUndefined = useMemo(() => 
        sortUserAddressSliceDataByYipCodes(userAddressData, userData), [userAddressData, userData])

    return [sortedDataOrUndefined, status]
}

function sortUserAddressSliceDataByYipCodes(userAddressData: UserAddressSliceData[] | undefined,
    userData: UserData | undefined) : UserAddressSliceData[] | undefined{
        if(!!userAddressData && !!userData){
            const yipCodes = userData.data.yipCodes
            return sortByKeyFunction(yipCodes, userAddressData, (data: UserAddressSliceData) => data.addressData.address.yipCode)
        }
        return undefined
}

export function useYipCodeToUserAddressMap(thunk: FetchUserAddressDataThunk)
:[Map<string, UserAddressSliceData>, LoadStatus]{
    const { sliceData: userAddressData, loadStatus: userAddressDataStatus} = useUserAddressDataHubFetch(thunk)
    const map = useMemoisedYipCodeToAddressMap(userAddressData)
    return [map, userAddressDataStatus]
}

export function useMemoisedYipCodeToAddressMap
(userAddressData: UserAddressSliceData[] | undefined): Map<string, UserAddressSliceData>{
    const map = useMemo(() => getYipCodeToUserAddressMap(userAddressData), [userAddressData])
    return map
}

export function getYipCodeToUserAddressMap(userAddressData: UserAddressSliceData[] | undefined)
: Map<string, UserAddressSliceData>{
    if(!userAddressData){
        return new Map<string, UserAddressSliceData>() 
    } 
    const map: Map<string, UserAddressSliceData> = inverseDataMap(userAddressData, a => a.addressData.address.yipCode)
    return map
}