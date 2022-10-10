import { configureStore } from "@reduxjs/toolkit"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { Provider } from "react-redux"
import { dateToSimpleDate } from "../../../../packages/YipStackLib/packages/YipAddress/util/date"
import { AddressItem } from "../../../../packages/YipStackLib/types/address/address"
import { Friend } from "../../../../packages/YipStackLib/types/friends/friend"
import { createMockApiRequestThunk, createMockTransformedInputThunk, createMockTransformedPortBodyOrFailureThunk } from "../../../../util/storybook/mockThunks"
import { numberToAlpha } from "../../../../util/storybook/storybookHelpers"
import { FetchAddressThunkInput } from "../address/fetch/fetchAddressThunk"
import { AddFriendSubmissionThunk } from "../friend/add/submit/addFriendSubmissionSlice"
import { friendsSliceGenerator, LoadedFriend, newLoadedFriend } from "./friendsSlice"
import { ConnectedViewFriends } from "./ViewFriends"

type ViewFriendsType = typeof ViewFriendsStory

export default {
  component: ViewFriendsStory,
  title: 'app/friends/view',
  args: {
    fetchFriendsDelayMilis: 300,
    fetchAddressDelayMilis: 1500,
    shouldFailSubmission: false,    
  },
} as ComponentMeta<ViewFriendsType>

type ViewFriendsStoryProps = {
  friends: Friend[],
  fetchFriendsDelayMilis: number,
  fetchAddressDelayMilis: number
}

function ViewFriendsStory(props: ViewFriendsStoryProps) {

  const { friends, fetchAddressDelayMilis, fetchFriendsDelayMilis } = props

  const loadedFriends = friends.map(newLoadedFriend)

  const mockFetchFriendsThunk = createMockApiRequestThunk<MessagePort, LoadedFriend[]>(
    loadedFriends, "mock/friends/fetch", fetchFriendsDelayMilis)
  
  // We don't expect this to be used in this story, but the friends slice needs one of these
  const mockSubmissionThunk: AddFriendSubmissionThunk
        = createMockTransformedPortBodyOrFailureThunk("mock/friend/submit", f => f, 0, false)

  const mockFetchAddressThunk = createMockTransformedInputThunk<FetchAddressThunkInput, AddressItem>(
    "mock/address/fetch", (i) => mockAddressItemFromYipCode(i.body.yipCode), fetchAddressDelayMilis)

  const mockFriendsReducer = friendsSliceGenerator(mockSubmissionThunk)(() => mockFetchFriendsThunk).slice.reducer

  const mockStore = configureStore({
    reducer: {
      friends: mockFriendsReducer
    }
  })

  return <Provider store={mockStore}>
    <ConnectedViewFriends fetchFriendsThunk={mockFetchFriendsThunk} fetchAddressThunk={mockFetchAddressThunk} />
  </Provider>

}

const arbitraryDate = dateToSimpleDate(new Date(2021, 12))

const Template: ComponentStory<ViewFriendsType> = (args: ViewFriendsStoryProps) => <ViewFriendsStory {...args} />

const longFriends = [...Array(300).keys()].map((_, i) => longRepeatedFriend(i))

export const Long = Template.bind({})
Long.args = {
  friends: longFriends
}

export const Standard = Template.bind({})
Standard.args = {
  friends: [
    { name: "BOB", yipCode: "XEC9229ALDN04" },
    { name: "Alice", yipCode: "QLC9229ALDN04" },
    { name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04" },
    { name: "Gauss", yipCode: "FFC9229ALDN04" },
    { name: "David Rogers", yipCode: "EN9229ALDN04" },
    { name: "The Great Sean Sheritan", yipCode: "YP9229ALDN04" },
    { name: "Zoro", yipCode: "ZO9229ALDN04" },
    { name: "Euler", yipCode: "EY9229ALDN04" },
    { name: "Einstein", yipCode: "NN9229ALDN04" }]
}

export const Empty = Template.bind({})
Empty.args = {
  friends: []
}

// Helpers

function longRepeatedFriend(i: number): Friend {

  const yipCode = `QLC9229ALD${i}`

  return { name: `${numberToAlpha(i, 3)}-${i}`, yipCode }

}

function mockAddressItemFromYipCode(yipCode: string) {
  return {
    address: {
      addressLines: ["123 Fake Street", "Imaginary Road", "Nowhereville", "Nonexistentland", "FUNPOSTCODE123"],
      aliasMap: {
        postCode: 4
      }
    },
    addressMetadata: { lastUpdated: arbitraryDate },
    yipCode
  }
}