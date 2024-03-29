import { configureStore } from "@reduxjs/toolkit"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import CreateAddressWrapper from "./CreateAddress"
import createAddressEditReducer from "./edit/createAddressEditSlice"
import { Provider } from "react-redux"
import { createMockThunkOrFailureThunk, createMockTransformedPortBodyThunk } from "../../../../../util/storybook/mockThunks"
import { createAddressSubmissionSliceGenerator } from "./submit/createAddressSubmissionSlice"
import { dateToSimpleDate } from "../../../../../packages/YipStackLib/packages/YipAddress/util/date"
import { DeleteAddressData, DeleteAddressThunk, userAddressDataSliceGenerator, UserAddressSliceData } from "../../../../useraddressdata/userAddressDataSlice"
import { UserData } from "../../../../../packages/YipStackLib/types/userData"
import { userDataSliceGenerator } from "../../../../userdata/userDataSlice"
import { ConnectedViewAddresses } from "../../addresses/view/ViewAddresses"
import { useState } from "react"
import { newMockCreateAddressSubmissionThunk } from "./submit/createAddressSubmissionMocks"
import { useMockYipcodeGenerator } from "../../../../../util/storybook/mockHooks"
import { EditRegistrationsData, EditRegistrationsSubmissionThunk } from "../../registrations/submit/editRegistrationsSubmissionSlice"

type StoryType = typeof StoryWrapper

enum DisplayScreen {
    ViewAddressesScreen = "ViewAddresses",
    CreateAddressScreen = "Create Address"
}

export default {
    title: 'app/address/create',
    args: {
        screen: DisplayScreen.CreateAddressScreen
    },
    argTypes: {
        screen: {
            options: DisplayScreen,
            control: {
                type: "select"
            }
      }
    }
} as ComponentMeta<StoryType>

const Template: ComponentStory<StoryType> = (args: StoryWrapperProps) => <StoryWrapper {...args} />

type StoryWrapperProps = {
    initialRawAddress?: string,
    delayMilis: number,
    initialName: string,
    shouldFail?: boolean,
    screen: string
}

const arbitraryDate1 = dateToSimpleDate(new Date(2020, 12))

function StoryWrapper(props: StoryWrapperProps) {

    const { initialRawAddress, initialName, screen } = props
    const { delayMilis, shouldFail } = props
    const storeThunkProps = { delayMilis, shouldFail: !!shouldFail }
    const mockYipCodeGenerator = useMockYipcodeGenerator("MOCKYIPCODE")
    const [storeThunks, ] = useState(() => createStoreAndThunks(storeThunkProps, mockYipCodeGenerator))

    const { mockStore, mockSubmissionThunk, mockAddressDataThunk, mockUserDataThunk, mockDeletionThunk } = 
        storeThunks

    return <Provider store={mockStore}>
        {screen === DisplayScreen.CreateAddressScreen && <CreateAddressWrapper {...{ initialRawAddress, initialName }} submissionThunk={mockSubmissionThunk} />}
        {screen === DisplayScreen.ViewAddressesScreen && <ConnectedViewAddresses 
           selectedYipCode={null}
           userAddressDataThunk={mockAddressDataThunk}
           userDataThunk={mockUserDataThunk}
           deleteAddressThunk={mockDeletionThunk} />}
    </Provider>
}

type StoreThunksProps = {
    delayMilis: number,
    shouldFail: boolean
}

function createStoreAndThunks(props: StoreThunksProps, mockYipCodeGenerator: () => string){
    const { delayMilis, shouldFail } = props    
    const mockSubmissionThunk = newMockCreateAddressSubmissionThunk(delayMilis, shouldFail, arbitraryDate1, mockYipCodeGenerator)

    const mockSubmissionReducer = createAddressSubmissionSliceGenerator(mockSubmissionThunk).reducer

    const mockAddressDataThunk = createMockThunkOrFailureThunk<UserAddressSliceData[], MessagePort, UserAddressSliceData[]>("mockUserAddressData", 
    [], d => d, delayMilis)

    const mockDeletionThunk: DeleteAddressThunk = createMockTransformedPortBodyThunk<DeleteAddressData, DeleteAddressData>(
      "mockDeleteAddress", d => d, delayMilis
    )

    const mockUpdateRegistrationsThunk: EditRegistrationsSubmissionThunk = createMockTransformedPortBodyThunk<EditRegistrationsData, EditRegistrationsData>(
      "mockUpdateRegistrations", d => d, delayMilis
    )

    const userAddressDataReducer = userAddressDataSliceGenerator(mockUpdateRegistrationsThunk, mockDeletionThunk, mockSubmissionThunk)
    (() => mockAddressDataThunk).slice.reducer

    const mockUserData: UserData = {
        sub: "Mock-SUB-32432789",
        data: {
          yipCodes: []
        }
    }

    const mockUserDataThunk = createMockThunkOrFailureThunk<UserData, MessagePort, UserData>
    ("mockUserData", mockUserData, d => d, delayMilis)
    const userDataReducer = userDataSliceGenerator(mockDeletionThunk)(() => mockUserDataThunk).slice.reducer
    

    const mockStore = configureStore({
        reducer: {
            userData: userDataReducer,
            userAddressData: userAddressDataReducer,
            createAddressEdit: createAddressEditReducer,
            createAddressSubmission: mockSubmissionReducer
        }
    })

    return {
        mockStore,
        mockSubmissionThunk,
        mockAddressDataThunk,
        mockUserDataThunk,
        mockDeletionThunk
    }
}

export const Standard = Template.bind({})
Standard.args = {
    delayMilis: 1500,
}

export const RawFilled = Template.bind({})
RawFilled.args = {
    initialRawAddress: `952 Soupdale Kitchens
Viking City
Illinois
60651`,
    delayMilis: 1500,
    initialName: "Raw Filled"
}

export const VeryLongDelay = Template.bind({})
VeryLongDelay.args = {
    initialRawAddress: `952 Soupdale Kitchens
Viking City
Illinois
60651`,
    // 10 min
    delayMilis: 600000,
    initialName: "Raw Filled"
}

export const Failure = Template.bind({})
Failure.args = {
    initialRawAddress: `952 Soupdale Kitchens
Viking City
Illinois
60651`,
    delayMilis: 0,
    initialName: "Raw Filled",
    shouldFail: true
}

export const FailureMediumDelay = Template.bind({})
FailureMediumDelay.args = {
    initialRawAddress: `952 Soupdale Kitchens
Viking City
Illinois
60651`,
    delayMilis: 1500,
    initialName: "Raw Filled",
    shouldFail: true
}