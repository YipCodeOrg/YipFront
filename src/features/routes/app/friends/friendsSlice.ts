import { LoadStatus } from "../../../../app/types"
import { Friend, isFriendArray } from "../../../../packages/YipStackLib/types/friends"
import { AddressItem } from "../../../../packages/YipStackLib/types/address/address"
import { fetchSliceGenerator } from "../../../../util/redux/slices/fetchSlice"
import { createApiGetThunk } from "../../../../util/redux/thunks"

export type LoadedFriend = {
    friend: Friend,
    address: AddressItem | null,
    addressLoadStatus: LoadStatus
}

function newLoadedFriend(friend: Friend): LoadedFriend{
    return {
        friend,
        address: null,
        addressLoadStatus: LoadStatus.NotLoaded
    }
}

const friendsSliceGenerator = fetchSliceGenerator<Friend[], LoadedFriend[]>
("userAddressData", d => d, "/addresses", isFriendArray)()

function generatefetchThunk(path: string, predicate: (obj: any) => obj is Friend[]) {
    return createApiGetThunk<Friend[], LoadedFriend[]>(path, predicate, f => f.map(newLoadedFriend))
}

export const { slice: friendsSlice, thunk: fetchFriends } = friendsSliceGenerator(generatefetchThunk)