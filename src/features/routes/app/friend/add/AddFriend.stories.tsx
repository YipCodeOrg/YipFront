import { configureStore } from "@reduxjs/toolkit"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { useMemo, useState } from "react"
import { Provider } from "react-redux"
import { dateToSimpleDate } from "../../../../../packages/YipStackLib/packages/YipAddress/util/date"
import { AddressItem } from "../../../../../packages/YipStackLib/types/address/address"
import { Friend } from "../../../../../packages/YipStackLib/types/friends/friend"
import { createMockApiRequestThunk, createMockTransformedInputThunk, createMockTransformedPortBodyOrFailureThunk } from "../../../../../util/storybook/mockThunks"
import { numberToAlpha } from "../../../../../util/storybook/storybookHelpers"
import { mockAddressItemFromYipCode } from "../../../../../util/storybook/thunks/mockFriendThunks"
import { FetchAddressThunkInput } from "../../address/fetch/fetchAddressThunk"
import { friendsSliceGenerator, LoadedFriend, newLoadedFriend } from "../../friends/friendsSlice"
import { ConnectedViewFriends } from "../../friends/ViewFriends"
import { ConnectedAddFriend, ConnectedAddFriendProps } from "./AddFriend"
import addFriendEdit from "./edit/addFriendEditSlice"
import { addFriendSubmissionSliceGenerator, AddFriendSubmissionThunk } from "./submit/addFriendSubmissionSlice"

type StoryType = typeof StoryWrapper

enum AddFriendStoryScreen{
    AddFriend = "Add Friend",
    ViewFriends = "View Friends"
}

export default {
    component: StoryWrapper,
    title: 'app/friends/add',
    args: {
        submissionDelayMilis: 1500,
        fetchDelayMilis: 300,
        shouldFailSubmission: false,
        screen: AddFriendStoryScreen.AddFriend
    },
    argTypes: {
        screen: {
            options: AddFriendStoryScreen,
            control: {
                type: "select"
            }
      }
    }
  } as ComponentMeta<StoryType>

const Template: ComponentStory<StoryType> = (args: AddFriendStoryProps) => <StoryWrapper {...args}/>

type AddFriendStoryProps = {
    initialFriends: Friend[],
    submissionDelayMilis: number,
    fetchDelayMilis: number,
    shouldFailSubmission: boolean,
    screen: AddFriendStoryScreen,
    initialNewFriend?: Friend | undefined
}

const arbitraryDate = dateToSimpleDate(new Date(2021, 12))

function StoryWrapper(props: AddFriendStoryProps){

    const { screen, initialNewFriend, ...rest } = props

    const [storeAndThunks, ] = useState(createStoreAndThunks({...rest}))
    const { mockFetchThunk, mockSubmissionThunk, mockFetchAddressThunk, mockStore } = storeAndThunks
    

    const addFriendProps: ConnectedAddFriendProps = {
        fetchThunk: mockFetchThunk,
        submissionThunk: mockSubmissionThunk,
        initialNewFriend
    }    

    return <Provider store={mockStore}>
        {
            screen === AddFriendStoryScreen.AddFriend
                ? <ConnectedAddFriend {...addFriendProps}/>
                : <ConnectedViewFriends fetchFriendsThunk={mockFetchThunk} fetchAddressThunk={mockFetchAddressThunk}/>
        }        
    </Provider>
}

type StoreThunkProps = {    
    initialFriends: Friend[],
    submissionDelayMilis: number,
    fetchDelayMilis: number,
    shouldFailSubmission: boolean,    
}

function createStoreAndThunks(props: StoreThunkProps){

    const { initialFriends, submissionDelayMilis, fetchDelayMilis, shouldFailSubmission} = props

    const initialLoadedFriends = useMemo(() => initialFriends.map(newLoadedFriend), [initialFriends])

    const mockFetchThunk = createMockApiRequestThunk<MessagePort, LoadedFriend[]>(
        initialLoadedFriends, "mock/friend/fetch", fetchDelayMilis)
    const mockSubmissionThunk: AddFriendSubmissionThunk
         = createMockTransformedPortBodyOrFailureThunk("mock/friend/submit", f => f, submissionDelayMilis, shouldFailSubmission)

    // Don't expect this to be used in this story
    const mockFetchAddressThunk = createMockTransformedInputThunk<FetchAddressThunkInput, AddressItem>(
        "mock/address/fetch", (i) => mockAddressItemFromYipCode(i.body.yipCode, arbitraryDate), 0)

    const mockSubmissionReducer = addFriendSubmissionSliceGenerator(mockSubmissionThunk).reducer
    const mockFetchReducer = friendsSliceGenerator(mockFetchAddressThunk, mockSubmissionThunk)(() => mockFetchThunk).slice.reducer

    const mockStore = configureStore({
        reducer: {
            addFriendSubmission: mockSubmissionReducer,
            friends: mockFetchReducer,
            addFriendEdit
        }
    })

    return {
        mockFetchThunk,
        mockSubmissionThunk,
        mockFetchAddressThunk,
        mockStore
    }
}

export const Standard = Template.bind({})
Standard.args={
    initialFriends: [{name: "Alice", yipCode: "QLC9229ALDN04"},
    {name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04"},
    {name: "Gauss", yipCode: "FFC9229ALDN04"}]
}

export const Filled = Template.bind({})
Filled.args={
    initialFriends: [{name: "Alice", yipCode: "QLC9229ALDN04"},
    {name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04"},
    {name: "Gauss", yipCode: "FFC9229ALDN04"}],
    initialNewFriend: {
        name: "Morgy Freedude",
        yipCode: "MOFREE1888"
    }
}

export const LongSubmissionDelay = Template.bind({})
LongSubmissionDelay.args={
    initialFriends: [{name: "Alice", yipCode: "QLC9229ALDN04"},
    {name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04"},
    {name: "Gauss", yipCode: "FFC9229ALDN04"}],
    initialNewFriend: {
        name: "Morgy Freedude",
        yipCode: "MOFREE1888"
    },
    // 10 min
    submissionDelayMilis: 600000
}

export const DupeName = Template.bind({})
DupeName.args={
    initialFriends: [{name: "Alice", yipCode: "QLC9229ALDN04"},
    {name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04"},
    {name: "Gauss", yipCode: "FFC9229ALDN04"}],
    initialNewFriend: {
        name: "Daniel Fanjkutic",
        yipCode: "MOFREE1888"
    }
}

export const SubmissionFailure = Template.bind({})
SubmissionFailure.args={
    initialFriends: [{name: "Alice", yipCode: "QLC9229ALDN04"},
    {name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04"},
    {name: "Gauss", yipCode: "FFC9229ALDN04"}],
    initialNewFriend: {
        name: "Subby McFailface",
        yipCode: "MOFREE1888"
    },
    shouldFailSubmission: true
}


const longFriends = makeLongFriendsArray(300)

export const Long = Template.bind({})
Long.args = {
    initialFriends: longFriends
}

const veryLongFriends = makeLongFriendsArray(3000)

export const VeryLong = Template.bind({})
VeryLong.args = {
    initialFriends: veryLongFriends
}


function longRepeatedFriend(i: number): Friend{
    return {name: `${numberToAlpha(i, 3)}-NAME-${i}`, yipCode: `YIPEEIAY${i}`}    
}

function makeLongFriendsArray(size: number){
    return [...Array(size).keys()].map((_, i) => longRepeatedFriend(i))
}