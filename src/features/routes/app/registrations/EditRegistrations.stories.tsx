import { configureStore } from "@reduxjs/toolkit";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { Provider } from "react-redux";
import { dateToSimpleDate } from "../../../../packages/YipStackLib/packages/YipAddress/util/date";
import { UserAddressData } from "../../../../packages/YipStackLib/types/address/address";
import { Registration} from "../../../../packages/YipStackLib/types/registrations";
import { UserData } from "../../../../packages/YipStackLib/types/userData";
import { createMockFailureApiRequestThunk, createMockThunkOrFailureThunk, createMockTransformedPortBodyThunk } from "../../../../util/storybook/mockThunks";
import { numberToAlpha } from "../../../../util/storybook/storybookHelpers";
import { DeleteAddressData, DeleteAddressThunk, FetchUserAddressDataThunk, newUserAddressSliceData, userAddressDataSliceGenerator, UserAddressSliceData } from "../../../useraddressdata/userAddressDataSlice";
import { userDataSliceGenerator } from "../../../userdata/userDataSlice";
import { newMockCreateAddressSubmissionThunk } from "../address/create/submit/createAddressSubmissionMocks";
import { ConnectedViewAddresses } from "../addresses/view/ViewAddresses";
import { ConnectedEditRegistrations } from "./EditRegistrations";
import { EditRegistrationsData, editRegistrationsSubmissionSliceGenerator, EditRegistrationsSubmissionThunk } from "./submit/editRegistrationsSubmissionSlice";


type StoryType = typeof StoryWrapper

enum DisplayScreen {
    ViewAddressesScreen = "ViewAddresses",
    EditRegistrationsScreen = "Edit Registrations"
}

export default {
    title: 'app/registrations/Edit',
    args: {
        screen: DisplayScreen.EditRegistrationsScreen,
        addressName: "Mock Address",
        submissionDelayMilis: 1500,
        shouldFailSubmission: false,
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

const arbitraryDate1 = new Date(2021, 8)
const arbitrarySimpleDate1 = dateToSimpleDate(arbitraryDate1)
const arbitraryDate2 = new Date(2021, 12)
const arbitrarySimpleDate2 = dateToSimpleDate(arbitraryDate2)
const arbitrarySimpleDate3 = dateToSimpleDate(new Date(2022, 12))
const mockYipCode = "YIPMOCKYMOCK"
const mockSub = "SUBBYMCMOCKERSON"

type StoryWrapperProps = {
    screen: string,
    initialRegistrations: Registration[],
    addressName: string,
    submissionDelayMilis: number,
    shouldFailSubmission?: boolean,
}

function StoryWrapper(props: StoryWrapperProps) {

    const { initialRegistrations, addressName, screen, 
        submissionDelayMilis, shouldFailSubmission } = props
    const storeThunkProps = { submissionDelayMilis,
        shouldFailSubmission: !!shouldFailSubmission,
        addressName,
        initialRegistrations }
    const [storeThunks, ] = useState(() => createStoreAndThunks(storeThunkProps))

    const { mockStore, mockSubmissionThunk, mockAddressDataThunk, mockUserDataThunk, mockDeletionThunk } = 
        storeThunks

    return <Provider store={mockStore}>
        {screen === DisplayScreen.EditRegistrationsScreen && <ConnectedEditRegistrations
            yipCode={mockYipCode} fetchThunk={mockAddressDataThunk} submissionThunk={mockSubmissionThunk}/>}
        {screen === DisplayScreen.ViewAddressesScreen && <ConnectedViewAddresses 
           selectedYipCode={null}
           userAddressDataThunk={mockAddressDataThunk}
           userDataThunk={mockUserDataThunk}
           deleteAddressThunk={mockDeletionThunk} />}
    </Provider>
}

type StoreThunksProps = {
    initialRegistrations: Registration[],
    submissionDelayMilis: number,
    shouldFailSubmission: boolean,
    addressName: string
}

function createStoreAndThunks(props: StoreThunksProps){
    const { submissionDelayMilis, shouldFailSubmission, initialRegistrations, addressName } = props    

    const mockSubmissionThunk: EditRegistrationsSubmissionThunk = shouldFailSubmission ? 
    createMockFailureApiRequestThunk("mockSubmitRegistrations", submissionDelayMilis)
    : createMockTransformedPortBodyThunk("mockSubmitRegistrations", d => d, submissionDelayMilis)

    const mockSubmissionReducer = editRegistrationsSubmissionSliceGenerator(mockSubmissionThunk).reducer

    const mockAddressDataThunk: FetchUserAddressDataThunk =
        createMockThunkOrFailureThunk<Registration[], MessagePort, UserAddressSliceData[]>("mockUserAddressData", 
            initialRegistrations, generateSingletonAddressData, submissionDelayMilis)

    function generateSingletonAddressData(initialRegistrations: Registration[]): UserAddressSliceData[]{
        const addressData: UserAddressData = {
            registrations: initialRegistrations,
            sub: mockSub,
            address: {address:  {
                addressLines: ["456 Lots of Money Lane", "Profit Road", "Cashville", "Workland", "BORINGPOSTCODE456"],
                aliasMap: {
                  postCode: 4
                }
              },
            addressMetadata: {lastUpdated: arbitrarySimpleDate2},
            yipCode: mockYipCode,
            name: addressName}
        }

        return [newUserAddressSliceData(addressData)]
    }

    const mockDeletionThunk: DeleteAddressThunk = createMockTransformedPortBodyThunk<DeleteAddressData, DeleteAddressData>(
      "mockDeleteAddress", d => d, submissionDelayMilis
    )

    const mockUpdateRegistrationsThunk: EditRegistrationsSubmissionThunk = createMockTransformedPortBodyThunk<EditRegistrationsData, EditRegistrationsData>(
      "mockUpdateRegistrations", d => d, submissionDelayMilis
    )

    // Don't expect this to be called in this story
    const mockCreateAddressSubmissionThunk = newMockCreateAddressSubmissionThunk
        (0, false, arbitrarySimpleDate1, () => "")

    const userAddressDataReducer = userAddressDataSliceGenerator(mockUpdateRegistrationsThunk, mockDeletionThunk,       mockCreateAddressSubmissionThunk)
    (() => mockAddressDataThunk).slice.reducer

    const mockUserData: UserData = {
        sub: "Mock-SUB-32432789",
        data: {
          yipCodes: []
        }
    }

    const mockUserDataThunk = createMockThunkOrFailureThunk<UserData, MessagePort, UserData>
    ("mockUserData", mockUserData, d => d, submissionDelayMilis)
    const userDataReducer = userDataSliceGenerator(mockDeletionThunk)(() => mockUserDataThunk).slice.reducer
    

    const mockStore = configureStore({
        reducer: {
            userData: userDataReducer,
            userAddressData: userAddressDataReducer,
            createAddressSubmission: mockSubmissionReducer,
            editRegistrationsSubmission: mockSubmissionReducer
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
    initialRegistrations: [{name: "Mozilla Developer Website", addressLastUpdated: arbitrarySimpleDate1, hyperlink: "https://developer.mozilla.org/"}, {name: "Whistle While you work", addressLastUpdated: arbitrarySimpleDate3}, {name: "WorkyMcWorkerson", addressLastUpdated: arbitrarySimpleDate2}, {name: "OWASP", addressLastUpdated: arbitrarySimpleDate3, hyperlink: "https://owasp.org/"}, {name: "That big teddy bear delivery company", addressLastUpdated: arbitrarySimpleDate3}],
    addressName: "Work"
}

export const DupeName = Template.bind({})
DupeName.args = {
    initialRegistrations: [{name: "Dupey McDuperson", addressLastUpdated: arbitrarySimpleDate1}, {name: "Dupey McDuperson", addressLastUpdated: arbitrarySimpleDate2}, {name: "", addressLastUpdated: arbitrarySimpleDate3}, {name: "", addressLastUpdated: arbitrarySimpleDate1}],
    addressName: "Father Ted's House"
}

const longRegistrations = makeLongRegistrationsArray(300)

export const Long = Template.bind({})
Long.args = {
    initialRegistrations: longRegistrations,
    addressName: "Long Way from Tip"
}

const veryLongRegistrations = makeLongRegistrationsArray(3000)

export const VeryLong = Template.bind({})
VeryLong.args = {
    initialRegistrations: veryLongRegistrations,
    addressName: "Very Long Way from Tip"
}

function longRepeatedRegistration(i: number): Registration{
    const addressLastUpdated = dateToSimpleDate(new Date(arbitraryDate1.getTime() + 86400000*i))
    return {name: `${numberToAlpha(i, 3)}-NAME-${i}`, addressLastUpdated,
        hyperlink: `https://${numberToAlpha(i, 3)}-${i}.com`}    
}

function makeLongRegistrationsArray(size: number){
    return [...Array(size).keys()].map((_, i) => longRepeatedRegistration(i))
}