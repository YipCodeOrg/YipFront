import { SimpleDate } from "../../../../../../packages/YipStackLib/packages/YipAddress/util/date"
import { AddressItem, CreateAddressData, UserAddressData } from "../../../../../../packages/YipStackLib/types/address/address"
import { createMockTransformedPortBodyOrFailureThunk } from "../../../../../../util/storybook/mockThunks"

export function createMockSubmissionThunk(delayMilis: number, shouldFail: boolean, date: SimpleDate){
    return createMockTransformedPortBodyOrFailureThunk("mockCreateAddressData", 
    responseGenerator(date), delayMilis, !!shouldFail)
}

function responseGenerator(date: SimpleDate){
        return function(d: CreateAddressData): UserAddressData {

        const item: AddressItem = {
            address: d.address,
            yipCode: "MOCKYIPCODE12345",
            addressMetadata: {
                lastUpdated:  date
            }
        }

        const response: UserAddressData = {
            address: item,
            sub: "Mock-SUB",
            registrations: []
        }

        if (d.name !== undefined) {
            response.name = d.name
        }

        return response

    }
}