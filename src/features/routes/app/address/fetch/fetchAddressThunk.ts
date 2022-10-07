import HttpMethod from "../../../../../packages/YipStackLib/packages/YipAddress/util/httpMethod"
import HttpStatusCode from "../../../../../packages/YipStackLib/packages/YipAddress/util/httpStatusCode"
import { AddressItem, isAddressItem } from "../../../../../packages/YipStackLib/types/address/address"
import { PortBodyInput } from "../../../../../util/redux/thunkHelpers"
import { createApiRequestThunk, PortBodyThunk } from "../../../../../util/redux/thunks"

export type FetchAddressBody = {
    yipCode: string
}

export type FetchAddressThunk = PortBodyThunk<FetchAddressBody, AddressItem>

export type FetchAddressThunkInput = PortBodyInput<FetchAddressBody>

export const fetchAddress: FetchAddressThunk =
    createApiRequestThunk<FetchAddressThunkInput, AddressItem, AddressItem>(
        i => i.port, isAddressItem, HttpStatusCode.OK, HttpMethod.GET, "/address", a => a,
        undefined, ({ body }, p) => `${p}/${body.yipCode}`)