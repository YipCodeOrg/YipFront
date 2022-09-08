import { configureStore } from "@reduxjs/toolkit"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import CreateAddressWrapper, { CreateAddress, CreateAddressWrapperProps } from "./CreateAddress"
import createAddressState from "../../../routes/app/address/createAddressSlice"
import { Provider } from "react-redux"

const mockStore = configureStore({
    reducer: {
        createAddress: createAddressState
    }
})

type StoryType = typeof StoryWrapper

export default {
    component: CreateAddress,
    title: 'app/address/create'
  } as ComponentMeta<StoryType>

const Template: ComponentStory<StoryType> = (args: CreateAddressWrapperProps) => <StoryWrapper {...args}/>

function StoryWrapper(props: CreateAddressWrapperProps){            

    return <Provider store={mockStore}>
        <CreateAddressWrapper {...props}/>
    </Provider>
}

export const Standard = Template.bind({})

export const RawFilled = Template.bind({})
RawFilled.args = {
    initialRawAddress: `952 Soupdale Kitchens
Viking City
Illinois
60651`
}