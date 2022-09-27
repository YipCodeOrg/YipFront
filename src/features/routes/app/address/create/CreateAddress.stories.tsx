import { configureStore } from "@reduxjs/toolkit"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import CreateAddressWrapper, { CreateAddress } from "./CreateAddress"
import createAddressEditReducer from "./createAddressEditSlice"
import { Provider } from "react-redux"
import { createMockTransformedPortBodyOrFailureThunk } from "../../../../../util/storybook/mockThunks"
import { AddressItem, CreateAddressData } from "../../../../../packages/YipStackLib/types/address/address"
import { createAddressSubmissionSliceGenerator } from "./createAddressSubmissionSlice"
import { dateToSimpleDate } from "../../../../../packages/YipStackLib/packages/YipAddress/util/date"


type StoryType = typeof StoryWrapper

export default {
    component: CreateAddress,
    title: 'app/address/create'
} as ComponentMeta<StoryType>

const Template: ComponentStory<StoryType> = (args: StoryWrapperProps) => <StoryWrapper {...args} />

type StoryWrapperProps = {
    initialRawAddress?: string,
    delayMilis: number,
    initialName: string,
    shouldFail?: boolean,
}

const arbitraryDate1 = dateToSimpleDate(new Date(2020, 12))

function StoryWrapper(props: StoryWrapperProps) {

    const { delayMilis, initialRawAddress, initialName, shouldFail } = props

    const mockSubmissionThunk = createMockTransformedPortBodyOrFailureThunk("mockCreateAddressData", 
    responseGenerator, delayMilis, !!shouldFail)

    function responseGenerator(d: CreateAddressData): AddressItem {

        const response: AddressItem = {
            address: d.address,
            yipCode: "MOCKYIPCODE12345",
            addressMetadata: {
                lastUpdated: arbitraryDate1
            }
        }

        if (d.name !== undefined) {
            response.name = d.name
        }

        return response

    }

    const mockSubmissionReducer = createAddressSubmissionSliceGenerator(mockSubmissionThunk).reducer

    const mockStore = configureStore({
        reducer: {

            createAddressEdit: createAddressEditReducer,
            createAddressSubmission: mockSubmissionReducer
        }
    })

    return <Provider store={mockStore}>
        <CreateAddressWrapper {...{ initialRawAddress, initialName }} submissionThunk={mockSubmissionThunk} />
    </Provider>
}

export const Standard = Template.bind({})
Standard.args = {
    delayMilis: 1500
}

export const RawFilled = Template.bind({})
RawFilled.args = {
    initialRawAddress: `952 Soupdale Kitchens
Viking City
Illinois
60651`,
    delayMilis: 1500,
    initialName: "Raw Filled"
}

export const VeryLongDelay = Template.bind({})
VeryLongDelay.args = {
    initialRawAddress: `952 Soupdale Kitchens
Viking City
Illinois
60651`,
    // 10 min
    delayMilis: 600000,
    initialName: "Raw Filled"
}

export const Failure = Template.bind({})
Failure.args = {
    initialRawAddress: `952 Soupdale Kitchens
Viking City
Illinois
60651`,
    delayMilis: 0,
    initialName: "Raw Filled",
    shouldFail: true
}

export const FailureMediumDelay = Template.bind({})
FailureMediumDelay.args = {
    initialRawAddress: `952 Soupdale Kitchens
Viking City
Illinois
60651`,
    delayMilis: 1500,
    initialName: "Raw Filled",
    shouldFail: true
}