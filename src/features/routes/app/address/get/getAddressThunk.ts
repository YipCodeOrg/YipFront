import { AsyncThunk } from "@reduxjs/toolkit"
import HttpMethod from "../../../../../packages/YipStackLib/packages/YipAddress/util/httpMethod"
import HttpStatusCode from "../../../../../packages/YipStackLib/packages/YipAddress/util/httpStatusCode"
import { AddressItem, isAddressItem } from "../../../../../packages/YipStackLib/types/address/address"
import { createApiRequestThunk } from "../../../../../util/redux/thunks"

export type GetAddressThunkInput = {
    port: MessagePort,
    yipCode: string
}

export type GetAddressThunk = AsyncThunk<AddressItem, GetAddressThunkInput, {}>

export const getAddress: GetAddressThunk =
    createApiRequestThunk<GetAddressThunkInput, AddressItem, AddressItem>(
        i => i.port, isAddressItem, HttpStatusCode.OK, HttpMethod.GET, "/address", a => a,
        undefined, ({ yipCode }, p) => `${p}/${yipCode}`)