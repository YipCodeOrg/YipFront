import { ComponentMeta, ComponentStory } from "@storybook/react"
import { LoadStatus } from "../../../../app/types"
import { ViewFriends, ViewFriendsProps } from "./ViewFriends"

type ViewFriendsType = typeof ViewFriends

export default {
    component: ViewFriends,
    title: 'app/friends/view'
  } as ComponentMeta<ViewFriendsType>

const Template: ComponentStory<ViewFriendsType> = (args: ViewFriendsProps) => <ViewFriends {...args}/>

export const Standard = Template.bind({})
Standard.args = {
  friends: [{friend: {name: "Alice", yipCode: "QLC9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded}]
}