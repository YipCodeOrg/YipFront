import { useAsyncHubFetch } from "../../../../app/hooks"
import { FetchSliceOf } from "../../../../util/redux/slices/fetchSlice"
import { selectFriendsSlice } from "./friendsSelectors"
import { FetchFriendsThunk, LoadedFriend } from "./friendsSlice"

export function useFriendsHubFetch(thunk: FetchFriendsThunk)
: FetchSliceOf<LoadedFriend[]>{
    return useAsyncHubFetch(thunk, selectFriendsSlice)  
}