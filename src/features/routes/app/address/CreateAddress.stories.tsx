import { configureStore } from "@reduxjs/toolkit"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import CreateAddressWrapper, { CreateAddress } from "./CreateAddress"
import createAddressEditReducer from "./createAddressEditSlice"
import { Provider } from "react-redux"
import { createMockTransformedPortBodyThunk } from "../../../../util/storybook/mockThunks"
import { AddressItem, CreateAddressData } from "../../../../packages/YipStackLib/types/address/address"
import { createAddressSubmissionSliceGenerator } from "./createAddressSubmissionSlice"


type StoryType = typeof StoryWrapper

export default {
    component: CreateAddress,
    title: 'app/address/create'
  } as ComponentMeta<StoryType>

const Template: ComponentStory<StoryType> = (args: StoryWrapperProps) => <StoryWrapper {...args}/>

type StoryWrapperProps = {
    initialRawAddress?: string,
    delayMilis: number   
}

const arbitraryDate1 = new Date(2020, 12)

function StoryWrapper(props: StoryWrapperProps){      

    const { delayMilis } = props

    const mockSubmissionThunk = createMockTransformedPortBodyThunk<CreateAddressData, AddressItem>(
        "mockCreateAddressData", responseGenerator, delayMilis)

    function responseGenerator(d: CreateAddressData): AddressItem{

        const response: AddressItem = {
            address: d.address,
            yipCode: "MOCKYIPCODE12345",
            addressMetadata: {
                lastUpdated: arbitraryDate1
            }
        }

        if(d.name !== undefined){
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
        <CreateAddressWrapper {...props} submissionThunk={mockSubmissionThunk}/>
    </Provider>
}

export const Standard = Template.bind({})
Standard.args = {
    delayMilis: 100
}

export const RawFilled = Template.bind({})
RawFilled.args = {
    initialRawAddress: `952 Soupdale Kitchens
Viking City
Illinois
60651`,
    delayMilis: 1500
}