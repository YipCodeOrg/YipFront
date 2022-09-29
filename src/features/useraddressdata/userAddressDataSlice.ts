import { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { useAsyncHubFetch } from "../../app/hooks";
import { isUserAddressData, isUserAddressDataArray, UserAddressData } from "../../packages/YipStackLib/types/address/address";
import { fetchSliceGenerator, FetchSliceOf } from "../../util/redux/slices/fetchSlice";
import { createApiDeleteThunk, createApiGetThunk, PortBodyThunkInput } from "../../util/redux/thunks";
import { useUserDataHubFetch } from "../userdata/userDataSlice";
import { getLowestLoadStatus, LoadStatus } from "../../app/types";
import { useMemo } from "react";
import { UserData } from "../../packages/YipStackLib/types/userData";
import { inverseDataMap, sortByKeyFunction } from "../../packages/YipStackLib/packages/YipAddress/util/arrayUtil";
import { isBoolean, isString, isTypedArray } from "../../packages/YipStackLib/packages/YipAddress/util/typePredicates";
import { compose2 } from "../../packages/YipStackLib/packages/YipAddress/util/misc";

export type FetchUserAddressDataThunk = AsyncThunk<UserAddressSliceData[], MessagePort, {}>
export type FetchUserDataThunk = AsyncThunk<UserData, MessagePort, {}>
export type UserAddressDataState = FetchSliceOf<UserAddressSliceData[]>

export type DeleteAddressData = {
    yipCode: string
}

export function isDeleteAddressData(obj: any): obj is DeleteAddressData{
    return isString(obj.yipCode)
}

export type DeleteAddressThunk = AsyncThunk<DeleteAddressData, PortBodyThunkInput<DeleteAddressData>, {}>

export const deleteAddress: DeleteAddressThunk = createApiDeleteThunk(
    "/address", isDeleteAddressData, r => r)

export const userAddressDataSliceGenerator = compose2(
    deletionBuilderUpdater,
    fetchSliceGenerator<UserAddressData[], UserAddressSliceData[]>
        ("userAddressData", d => d, "/addresses", isUserAddressDataArray)
)

function deletionBuilderUpdater(thunk: DeleteAddressThunk){
    return function(builder: ActionReducerMapBuilder<UserAddressDataState>){
        builder.addCase(thunk.pending, (state, action) => {
            const yipCode = action.meta.arg.body.yipCode
            handleAddressUpdate(state, yipCode, a => a.isDeleting = true)
        })
        .addCase(thunk.rejected, (state, action) => {
            const yipCode = action.meta.arg.body.yipCode
            handleAddressUpdate(state, yipCode, a => a.isDeleting = false)
        })
        .addCase(thunk.fulfilled, (state, action) => {
            const yipCode = action.meta.arg.body.yipCode
            handleYipCodeUpdate(state, yipCode, function(data, index){
                data.splice(index, 1)
            })
        })
        return builder
    }
}

function handleAddressUpdate(state: UserAddressDataState, yipCode: string, handler: (a: UserAddressSliceData) => void){    
    handleYipCodeUpdate(state, yipCode, function(data, index){
        const address = data[index]
        if(address !== undefined){
            handler(address)
        }
    })    
}

function handleYipCodeUpdate(state: UserAddressDataState, yipCode: string, 
    handler: (data: UserAddressSliceData[], index: number) => void){    
    const index = findIndexByYipCode(state, yipCode)
    const data = state.sliceData            
    if(data !== undefined){
        handler(data, index)
    }       
}

function findIndexByYipCode(state: UserAddressDataState, yipCode: string): number {
    const addresses = state.sliceData
    if(addresses === undefined){
        return -1
    }
    const index = addresses.findIndex(a => a.addressData.address.yipCode === yipCode)
    return index
}


export type UserAddressSliceData = {
    addressData: UserAddressData,
    isDeleting: boolean
}

function isUserAddressSliceData(obj: any): obj is UserAddressSliceData{
    if(!isBoolean(obj.isDeleting)){
        return false
    }
    if(!isUserAddressData(obj.addressData)){
        return false
    }
    return true
}

export function isUserAddressSliceDataArray(obj: any): obj is UserAddressSliceData[]{
    return isTypedArray(obj, isUserAddressSliceData)
}

export function newUserAddressSliceData(addressData: UserAddressData): UserAddressSliceData{
    return {
        addressData,
        isDeleting: false
    }
}

function generateThunk(path: string, predicate: (obj: any) => obj is UserAddressData[]){
    return createApiGetThunk<UserAddressData[], UserAddressSliceData[]>(path, predicate, r => r.map(newUserAddressSliceData))
}

export const { slice: userAddressDataSlice, thunk: fetchUserAddressData } = userAddressDataSliceGenerator(deleteAddress)(generateThunk)

export const selectUserAddressDataSlice = (state: RootState) => state.userAddressData
export const selectUserAddressData = (state: RootState) => state.userAddressData.sliceData
export const selectUserAddressDataStatus = (state: RootState) => state.userAddressData.loadStatus

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

export default userAddressDataSlice.reducer