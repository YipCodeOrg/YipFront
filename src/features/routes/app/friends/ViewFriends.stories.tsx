import { ComponentMeta, ComponentStory } from "@storybook/react"
import { ViewFriends, ViewFriendsProps } from "./ViewFriends"

type ViewFriendsType = typeof ViewFriends

export default {
    component: ViewFriends,
    title: 'app/friends/view'
  } as ComponentMeta<ViewFriendsType>

const Template: ComponentStory<ViewFriendsType> = (args: ViewFriendsProps) => <ViewFriends {...args}/>

export const Standard = Template.bind({})