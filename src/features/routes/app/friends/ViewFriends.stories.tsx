import { ComponentMeta, ComponentStory } from "@storybook/react"
import { LoadStatus } from "../../../../app/types"
import { ViewFriends, ViewFriendsProps } from "./ViewFriends"

type ViewFriendsType = typeof ViewFriends
const arbitraryDate = new Date(2021, 12)

export default {
    component: ViewFriends,
    title: 'app/friends/view'
  } as ComponentMeta<ViewFriendsType>

const Template: ComponentStory<ViewFriendsType> = (args: ViewFriendsProps) => <ViewFriends {...args}/>

export const Standard = Template.bind({})
Standard.args = {
  friends: [{friend: {name: "Alice", yipCode: "QLC9229ALDN04"}, address: {address: {
    addressLines: ["123 Fake Street", "Imaginary Road", "Nowhereville", "Nonexistentland", "FUNPOSTCODE123"],
    aliasMap: {
      postCode: 4
    }
  },
    addressMetadata: {lastUpdated: arbitraryDate},
    yipCode: "QLC9229ALDN04"},
    addressLoadStatus: LoadStatus.Loaded},
    {friend: {name: "BOB", yipCode: "XEC9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.Pending},
    {friend: {name: "Gauss", yipCode: "FFC9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "Euler", yipCode: "EY9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.Failed},
    {friend: {name: "Einstein", yipCode: "NN9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "David Rogers", yipCode: "EN9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "The Great Sean Sheritan", yipCode: "YP9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    //Repeats
    {friend: {name: "BOB", yipCode: "XEC9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.Pending},
    {friend: {name: "Gauss", yipCode: "FFC9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "Euler", yipCode: "EY9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.Failed},
    {friend: {name: "Einstein", yipCode: "NN9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "David Rogers", yipCode: "EN9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "The Great Sean Sheritan", yipCode: "YP9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    //Repeats
    {friend: {name: "BOB", yipCode: "XEC9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.Pending},
    {friend: {name: "Gauss", yipCode: "FFC9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "Euler", yipCode: "EY9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.Failed},
    {friend: {name: "Einstein", yipCode: "NN9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "David Rogers", yipCode: "EN9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded},
    {friend: {name: "The Great Sean Sheritan", yipCode: "YP9229ALDN04"}, address: null, addressLoadStatus: LoadStatus.NotLoaded}]
}

export const Empty = Template.bind({})
Empty.args = {
  friends: []
}

function longRepeatedFriend(i: number){
  return {friend: {name: `BOB-${i}`, yipCode: "QLC9229ALDN04"}, address: {address: {
      addressLines: ["123 Fake Street", "Imaginary Road", "Nowhereville", "Nonexistentland", "FUNPOSTCODE123"],
      aliasMap: {
        postCode: 4
      }
    },
    addressMetadata: {lastUpdated: arbitraryDate},
    yipCode: "QLC9229ALDN04"},
    addressLoadStatus: i % 10 === 0 ? LoadStatus.Pending : i % 5 === 0 ? LoadStatus.NotLoaded : LoadStatus.Loaded}
}

const longFriends = [...Array(300).keys()].map((_, i) => longRepeatedFriend(i))

export const Long = Template.bind({})
Long.args={
  friends: longFriends
}