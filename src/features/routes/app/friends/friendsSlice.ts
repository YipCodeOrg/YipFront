import { LoadStatus } from "../../../../app/types"
import { Friend, isFriendArray } from "../../../../packages/YipStackLib/types/friends/friend"
import { AddressItem } from "../../../../packages/YipStackLib/types/address/address"
import { fetchSliceGenerator, FetchSliceOf } from "../../../../util/redux/slices/fetchSlice"
import { createApiGetThunk } from "../../../../util/redux/thunks"
import { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit"
import { AddFriendSubmissionThunk, submitAddFriend } from "../friend/add/submit/addFriendSubmissionSlice"
import { compose2Higher, compose2PairDomain } from "../../../../packages/YipStackLib/packages/YipAddress/util/misc"
import { fetchAddress, FetchAddressThunk } from "../address/fetch/fetchAddressThunk"

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

const mainBuilderUpdater = compose2Higher(addressFetchedBuilderUpdater, friendAddedBuilderUpdater)

export const friendsSliceGenerator = compose2PairDomain(mainBuilderUpdater, 
    fetchSliceGenerator<Friend[], LoadedFriend[]>
    ("userAddressData", d => d, "/addresses", isFriendArray))

function addressFetchedBuilderUpdater(thunk: FetchAddressThunk){
    return function (builder: ActionReducerMapBuilder<FriendsState>){
        builder.addCase(thunk.pending, (state, action) => {
            const yipCode = action.meta.arg.body.yipCode
            updateFriend(state, yipCode, f => f.addressLoadStatus = LoadStatus.Pending)
        }).addCase(thunk.rejected, (state, action) => {
            const yipCode = action.meta.arg.body.yipCode
            updateFriend(state, yipCode, f => f.addressLoadStatus = LoadStatus.Failed)
        }).addCase(thunk.fulfilled, (state, action) => {
            const yipCode = action.meta.arg.body.yipCode
            const address = action.payload
            updateFriend(state, yipCode, f => setLoaded(f, address))
        })
        return builder
    }
}

function setLoaded(friend: LoadedFriend, address: AddressItem){
    friend.address = address
    friend.addressLoadStatus = LoadStatus.Loaded
}

function updateFriend(state: FriendsState, yipCode: string, updater: (_ : LoadedFriend) => void){
    const data = state.sliceData
    if(data !== undefined){
        const friend = data.find(f => f.friend.yipCode === yipCode)
        if(friend !== undefined){
            updater(friend)
        }
    }
}

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

export const { slice: friendsSlice, thunk: fetchFriends } =
    friendsSliceGenerator(fetchAddress, submitAddFriend)(generatefetchThunk)

export default friendsSlice.reducer