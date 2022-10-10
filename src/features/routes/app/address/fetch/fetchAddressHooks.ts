import { useCallback } from "react";
import { useThunkDispatch } from "../../../../../app/hooks";
import { LoadStatus } from "../../../../../app/types";
import { AddressItem } from "../../../../../packages/YipStackLib/types/address/address";
import { LoadedFriend } from "../../friends/friendsSlice";
import { FetchAddressThunk, FetchAddressBody } from "./fetchAddressThunk";

export function useFetchAddressDispatch(thunk: FetchAddressThunk){
    return useThunkDispatch<FetchAddressBody, AddressItem>(thunk)
}

export function useFetchIfNotLoaded(thunk: FetchAddressThunk, loadedFriend: LoadedFriend){
    const fetchDispatch = useFetchAddressDispatch(thunk)
    const callback = useCallback(function(){
        const yipCode = loadedFriend.friend.yipCode
        if(loadedFriend.addressLoadStatus === LoadStatus.NotLoaded){
            fetchDispatch({yipCode})
        }        
    }, [fetchDispatch, loadedFriend])
    return callback
}