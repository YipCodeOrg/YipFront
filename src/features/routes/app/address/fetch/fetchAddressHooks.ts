import { useThunkDispatch } from "../../../../../app/hooks";
import { AddressItem } from "../../../../../packages/YipStackLib/types/address/address";
import { FetchAddressThunk, FetchAddressBody } from "./fetchAddressThunk";

export function useFetchAddressDispatch(thunk: FetchAddressThunk){
    return useThunkDispatch<FetchAddressBody, AddressItem>(thunk)
}