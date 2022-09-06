import { ComponentMeta, ComponentStory } from "@storybook/react"
import { CreateAddress } from "./CreateAddress"

type StoryType = typeof StoryWrapper

export default {
    component: CreateAddress,
    title: 'app/address/create'
  } as ComponentMeta<StoryType>

const Template: ComponentStory<StoryType> = (args: CreateAddressStoryProps) => <StoryWrapper {...args}/>


type CreateAddressStoryProps = {
    
}

function StoryWrapper(props: CreateAddressStoryProps){            

    return <></>
}

export const Standard = Template.bind({})