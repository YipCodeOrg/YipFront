import { LoadStatus } from "../../../../app/types"
import { Friend, isFriendArray } from "../../../../packages/YipStackLib/types/friends/friend"
import { AddressItem } from "../../../../packages/YipStackLib/types/address/address"
import { fetchSliceGenerator, FetchSliceOf } from "../../../../util/redux/slices/fetchSlice"
import { createApiGetThunk } from "../../../../util/redux/thunks"
import { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit"
import { AddFriendSubmissionThunk, submitAddFriend } from "../friend/add/submit/addFriendSubmissionSlice"
import { compose2 } from "../../../../packages/YipStackLib/packages/YipAddress/util/misc"

export type FetchFriendsThunk = AsyncThunk<LoadedFriend[], MessagePort, {}>
export type FriendsState = FetchSliceOf<LoadedFriend[]>

export type LoadedFriend = {
    friend: Friend,
    address: AddressItem | null,
    addressLoadStatus: LoadStatus
}

export function newLoadedFriend(friend: Friend): LoadedFriend{
    return {
        friend,
        address: null,
        addressLoadStatus: LoadStatus.NotLoaded
    }
}

export const friendsSliceGenerator = compose2(friendAddedBuilderUpdater, 
    fetchSliceGenerator<Friend[], LoadedFriend[]>
    ("userAddressData", d => d, "/addresses", isFriendArray))

function friendAddedBuilderUpdater(thunk: AddFriendSubmissionThunk) {
    return function (builder: ActionReducerMapBuilder<FriendsState>) {
        builder.addCase(thunk.fulfilled, (state, action) => {
            const friend = action.payload
            addFriend(state, friend)
        })
        return builder
    }
}

function addFriend(state: FriendsState, friend: Friend){
    const sliceData = state.sliceData
    const newSliceData = newLoadedFriend(friend)
    if(sliceData === undefined){
        state.sliceData = [newSliceData]
    } else {
        sliceData.push(newSliceData)
    }
}

function generatefetchThunk(path: string, predicate: (obj: any) => obj is Friend[]) : FetchFriendsThunk{
    return createApiGetThunk<Friend[], LoadedFriend[]>(path, predicate, f => f.map(newLoadedFriend))
}

export const { slice: friendsSlice, thunk: fetchFriends } = friendsSliceGenerator(submitAddFriend)(generatefetchThunk)

export default friendsSlice.reducer