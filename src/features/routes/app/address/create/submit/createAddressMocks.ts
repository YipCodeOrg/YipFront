import { useRef } from "react"
import { SimpleDate } from "../../../../../../packages/YipStackLib/packages/YipAddress/util/date"
import { AddressItem, CreateAddressData, UserAddressData } from "../../../../../../packages/YipStackLib/types/address/address"
import { createMockTransformedPortBodyOrFailureThunk } from "../../../../../../util/storybook/mockThunks"

export function createMockSubmissionThunk(delayMilis: number, shouldFail: boolean,
    date: SimpleDate, yipCodeGenerator: () => string){
    return createMockTransformedPortBodyOrFailureThunk("mockCreateAddressData", 
    responseGenerator(date, yipCodeGenerator), delayMilis, !!shouldFail)
}

export function useMockYipcodeGenerator(seed: string){
    const suffix = useRef<number>(0)
    return function(){
        suffix.current++
        return `${seed}${suffix.current}` 
    }
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