import { LoadStatus } from "../../../../app/types"
import { Address } from "../../../../packages/YipStackLib/packages/YipAddress/core/address"
import { Friend } from "../../../../packages/YipStackLib/types/friends"

export type LoadedFriend = {
    friend: Friend,
    address: Address | null,
    addressLoadStatus: LoadStatus
}