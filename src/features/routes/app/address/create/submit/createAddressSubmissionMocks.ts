import { SimpleDate } from "../../../../../../packages/YipStackLib/packages/YipAddress/util/date"
import { AddressItem, CreateAddressData, UserAddressData } from "../../../../../../packages/YipStackLib/types/address/address"
import { createMockTransformedPortBodyOrFailureThunk } from "../../../../../../util/storybook/mockThunks"

export function newMockCreateAddressSubmissionThunk(delayMilis: number, shouldFail: boolean,
    date: SimpleDate, yipCodeGenerator: () => string){
    return createMockTransformedPortBodyOrFailureThunk("mockCreateAddressData", 
    responseGenerator(date, yipCodeGenerator), delayMilis, !!shouldFail)
}

function responseGenerator(date: SimpleDate, yipCodeGenerator: () => string){
        return function(d: CreateAddressData): UserAddressData {

        const item: AddressItem = {
            address: d.address,
            yipCode: yipCodeGenerator(),
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