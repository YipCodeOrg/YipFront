import { configureStore } from "@reduxjs/toolkit"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import CreateAddressWrapper, { CreateAddress } from "./CreateAddress"
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

const Template: ComponentStory<StoryType> = (args: CreateAddressStoryProps) => <StoryWrapper {...args}/>


type CreateAddressStoryProps = {
    
}

function StoryWrapper(_: CreateAddressStoryProps){            

    return <Provider store={mockStore}>
        <CreateAddressWrapper/>
    </Provider>
}

export const Standard = Template.bind({})