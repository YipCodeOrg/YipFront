import { LoadStatus } from "../../../../app/types"
import { Friend } from "../../../../packages/YipStackLib/types/friends"
import { AddressItem } from "../../../../packages/YipStackLib/types/userAddressData"

export type LoadedFriend = {
    friend: Friend,
    address: AddressItem | null,
    addressLoadStatus: LoadStatus
}