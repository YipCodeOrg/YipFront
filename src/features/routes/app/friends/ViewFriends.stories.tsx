import { ComponentMeta, ComponentStory } from "@storybook/react"
import { LoadStatus } from "../../../../app/types"
import { FriendCard, FriendCardProps, FriendCardWrapperProps, ViewFriends, ViewFriendsProps } from "./ViewFriends"

type ViewFriendsType = typeof ViewFriends
const arbitraryDate = new Date(2021, 12)

export default {
    component: ViewFriends,
    title: 'app/friends/view'
  } as ComponentMeta<ViewFriendsType>

const Template: ComponentStory<ViewFriendsType> = (args: ViewFriendsProps) => <ViewFriends {...args}/>

const longFriends = [...Array(300).keys()].map((_, i) => longRepeatedFriend(i))

export const Long = Template.bind({})
Long.args={
  friends: longFriends.map(f => f.friend),
  renderCard: MockFriendCardWrapper
}

export const Standard = Template.bind({})
Standard.args = {
    friends: [{name: "Alice", yipCode: "QLC9229ALDN04"},
    {name: "BOB", yipCode: "XEC9229ALDN04"},
    {name: "Gauss", yipCode: "FFC9229ALDN04"},
    {name: "Euler", yipCode: "EY9229ALDN04"},
    {name: "Einstein", yipCode: "NN9229ALDN04"},
    {name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04"},
    {name: "David Rogers", yipCode: "EN9229ALDN04"},
    {name: "The Great Sean Sheritan", yipCode: "YP9229ALDN04"}],
    renderCard: MockFriendCardWrapper
}

export const Empty = Template.bind({})
Empty.args = {
  friends: [],
  renderCard: MockFriendCardWrapper
}

// Helpers

function longRepeatedFriend(i: number){
  
  const yipCode = `QLC9229ALD${i}`
  
  return {friend: {name: `BOB-${i}`, yipCode}, address: {address: {
    addressLines: ["123 Fake Street", "Imaginary Road", "Nowhereville", "Nonexistentland", "FUNPOSTCODE123"],
    aliasMap: {
      postCode: 4
    }
  },
  addressMetadata: {lastUpdated: arbitraryDate},
  yipCode},
  addressLoadStatus: i % 10 === 0 ? LoadStatus.Pending : i % 5 === 0 ? LoadStatus.NotLoaded : LoadStatus.Loaded}
  
}

function MockFriendCardWrapper(props: FriendCardWrapperProps){
  
  const { friend, disclosure } = props
  
  const friendCardProps: FriendCardProps = {
    loadedFriend: {
      friend,
      address: null,
      addressLoadStatus: LoadStatus.Failed,      
    },
    disclosure
  }

  return <FriendCard {...friendCardProps} />
}