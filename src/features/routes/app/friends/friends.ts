import { LoadStatus } from "../../../../app/types"
import { Friend } from "../../../../packages/YipStackLib/types/friends"
import { AddressItem } from "../../../../packages/YipStackLib/types/address/address"

export type LoadedFriend = {
    friend: Friend,
    address: AddressItem | null,
    addressLoadStatus: LoadStatus
}