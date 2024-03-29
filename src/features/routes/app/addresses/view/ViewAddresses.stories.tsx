import { configureStore } from "@reduxjs/toolkit";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Provider } from "react-redux";
import { dateToSimpleDate } from "../../../../../packages/YipStackLib/packages/YipAddress/util/date";
import { UserAddressData } from "../../../../../packages/YipStackLib/types/address/address";
import { UserData } from "../../../../../packages/YipStackLib/types/userData";
import { useMockYipcodeGenerator } from "../../../../../util/storybook/mockHooks";
import { createMockThunkOrFailureThunk, createMockTransformedPortBodyThunk } from "../../../../../util/storybook/mockThunks";
import { DeleteAddressData, DeleteAddressThunk, newUserAddressSliceData, userAddressDataSliceGenerator, UserAddressSliceData } from "../../../../useraddressdata/userAddressDataSlice";
import { userDataSliceGenerator } from "../../../../userdata/userDataSlice";
import { newMockCreateAddressSubmissionThunk } from "../../address/create/submit/createAddressSubmissionMocks";
import { EditRegistrationsData, EditRegistrationsSubmissionThunk } from "../../registrations/submit/editRegistrationsSubmissionSlice";
import { ConnectedViewAddresses, ViewAddresses } from "./ViewAddresses";

type StoryType = typeof StoryWrapper

enum StoryYipCode {
  Home = "QLC9229ALDN04",
  Work = "FXL82830124",
  Parents = "YY2K1FHAL1",
  NoName = "XY4BSRRB1TU5F9",
  EmptyAddress = "QR6CRPE0TV5G8"
}

export default {
    component: ViewAddresses,
    title: 'app/ViewAddresses',
    argTypes: {
      selectedYipCode: {
        options: StoryYipCode
      }
    }
  } as ComponentMeta<StoryType>

const Template: ComponentStory<StoryType> = (args: StoryWrapperProps) => <StoryWrapper {...args}/>

type StoryWrapperProps = {
  selectedYipCode: string | null,
  userAddressData: UserAddressData[] | null,
  delayMilis: number
}

function StoryWrapper(props: StoryWrapperProps){

  const { selectedYipCode, userAddressData, delayMilis } = props

  const sliceData = userAddressData?.map(newUserAddressSliceData) ?? null

  const mockAddressDataThunk = createMockThunkOrFailureThunk<UserAddressSliceData[], MessagePort, UserAddressSliceData[]>("mockUserAddressData", 
    sliceData, d => d, delayMilis)

    const mockDeletionThunk: DeleteAddressThunk = createMockTransformedPortBodyThunk<DeleteAddressData, DeleteAddressData>(
      "mockDeleteAddress", d => d, delayMilis
    )

    const mockUpdateRegistrationsThunk: EditRegistrationsSubmissionThunk = createMockTransformedPortBodyThunk<EditRegistrationsData, EditRegistrationsData>(
      "mockUpdateRegistrations", d => d, delayMilis
    )

    const mockYipCodeGenerator = useMockYipcodeGenerator("MOCKYIPCODE")  
  const mockSubmissionThunk = newMockCreateAddressSubmissionThunk(delayMilis, false, arbitraryDate1, mockYipCodeGenerator)

  const userAddressDataReducer = userAddressDataSliceGenerator(mockUpdateRegistrationsThunk, mockDeletionThunk, mockSubmissionThunk)
    (() => mockAddressDataThunk).slice.reducer
  
  const mockUserDataThunk = createMockThunkOrFailureThunk<UserAddressData[], MessagePort, UserData>
    ("mockUserData", userAddressData, mockUserDataGenerator, delayMilis)
  const userDataReducer = userDataSliceGenerator(mockDeletionThunk)(() => mockUserDataThunk).slice.reducer


  function mockUserDataGenerator(ads: UserAddressData[]){
    //Non-MVP: We could inject user data into each story as a story arg.
    const mockUserData: UserData = {
      sub: "Mock-SUB-32432789",
      data: {
        //For now, we just pass in yipCodes as they are ordered in the address data
        yipCodes: ads.map(d => d.address.yipCode)
      }
    }
    return mockUserData
  }
    
  const mockStore = configureStore({
      reducer: {
        userAddressData: userAddressDataReducer,
        userData: userDataReducer
      }
  })
  
  return <Provider store={mockStore}>
      <ConnectedViewAddresses {...{selectedYipCode}}
        userAddressDataThunk={mockAddressDataThunk}
        userDataThunk={mockUserDataThunk}
        deleteAddressThunk={mockDeletionThunk} />
  </Provider>
}

const arbitraryDate1 = dateToSimpleDate(new Date(2020, 12))
const arbitraryDate2 = dateToSimpleDate(new Date(2021, 12))
const arbitraryDate3 = dateToSimpleDate(new Date(2022, 12))


const homeAddress: UserAddressData = {
  sub: "cognito-sub",
  name: "Home",
  address: {address: {
    addressLines: ["123 Fake Street", "Imaginary Road", "Nowhereville", "Nonexistentland", "FUNPOSTCODE123"],
    aliasMap: {
      postCode: 4
    }
  },
    addressMetadata: {lastUpdated: arbitraryDate2},
    yipCode: StoryYipCode.Home},
  registrations: [{name: "DentalDevils.ie", addressLastUpdated: arbitraryDate3}, {name: "HealthInsuranceHeretics.com", addressLastUpdated: arbitraryDate3}]
}

const workAddress: UserAddressData = {
  sub: "cognito-sub",
  name: "Work",
  address: {address:  {
    addressLines: ["456 Lots of Money Lane", "Profit Road", "Cashville", "Workland", "BORINGPOSTCODE456"],
    aliasMap: {
      postCode: 4
    }
  },
    addressMetadata: {lastUpdated: arbitraryDate2},
    yipCode: StoryYipCode.Work},
  registrations: [{name: "Mozilla Developer Website", addressLastUpdated: arbitraryDate1, hyperlink: "https://developer.mozilla.org/"}, {name: "Whistle While you work", addressLastUpdated: arbitraryDate3}, {name: "WorkyMcWorkerson", addressLastUpdated: arbitraryDate2}, {name: "OWASP", addressLastUpdated: arbitraryDate3, hyperlink: "https://owasp.org/"}, {name: "That big teddy bear delivery company", addressLastUpdated: arbitraryDate3}]
}

const parentsAddress: UserAddressData = {
  sub: "cognito-sub",
  name: "Parents",
  address: {address:  {
    addressLines: ["890 Memory Lane", "Childhood Road", "Co. Youth", "Youngland", "NOSTALGICPOSTCODE890"],
    aliasMap: {
      postCode: 4
    }
  },
    addressMetadata: {lastUpdated: arbitraryDate2},
    yipCode: StoryYipCode.Parents},
  registrations: [{name: "Childhood School Alumni Club", addressLastUpdated: arbitraryDate3}]
}

const noNameAddress : UserAddressData = {
  sub: "cognito-sub",
  address: {address:  {
    addressLines: ["747 Mystery Road", "Bermuda Trianble", "Nowhere"],
    aliasMap: {}
  },
    addressMetadata: {lastUpdated: arbitraryDate2},
    yipCode: StoryYipCode.NoName},
  registrations: []
}

const emptyAddress: UserAddressData = {
  sub: "cognito-sub",
  address: {address:  {
    addressLines: [],
    aliasMap: {}
  },
    addressMetadata: {lastUpdated: arbitraryDate2},
    yipCode: StoryYipCode.EmptyAddress},
  registrations: []
}

const emptyRegistraiontsAddress: UserAddressData = {
  sub: "cognito-sub",
  address: {address:  {
    addressLines: ["890 Memory Lane", "Childhood Road", "Co. Youth", "Youngland", "NOSTALGICPOSTCODE890"],
    aliasMap: {
      postCode: 4
    }
  },
    addressMetadata: {lastUpdated: arbitraryDate2},
    yipCode: StoryYipCode.EmptyAddress},
  registrations: []
}


function anotherLongRegistration(){
  return {name: "Another registration", addressLastUpdated: arbitraryDate3}
}

const moreLongRegistrations = [...Array(300).keys()].map(_ => anotherLongRegistration())

const longAddress: UserAddressData = {
  sub: "cognito-sub",
  name: "Work",
  address: {address:  {
    addressLines: ["456 Money Lane", "Profit Road", "A longer-than-expected address line which serves to test how the UI handles this case. Some extra characters added here to make it even longer.", "Workland", "BORINGPOSTCODE456"],
    aliasMap: {
      postCode: 4
    }
  },
    addressMetadata: {lastUpdated: arbitraryDate2},
    yipCode: StoryYipCode.Work},
  registrations: [{name: "HateYourBoss.co.uk", addressLastUpdated: arbitraryDate3}, {name: "Whistle While you work", addressLastUpdated: arbitraryDate3}, {name: "A longer-than-expected registration description which serves to test what happens the display in this case.", addressLastUpdated: arbitraryDate3}, {name: "Bored.of.myjob", addressLastUpdated: arbitraryDate3}, {name: "That big teddy bear delivery company", addressLastUpdated: arbitraryDate3}, ...moreLongRegistrations]
}

export const Standard = Template.bind({})
Standard.args = {
    delayMilis: 100,
    userAddressData: [homeAddress, workAddress, parentsAddress, noNameAddress, emptyAddress],
    selectedYipCode: workAddress.address.yipCode
}

export const EmptyRegistrations = Template.bind({})
EmptyRegistrations.args = {
  delayMilis: 100,
  userAddressData: [emptyRegistraiontsAddress],
  selectedYipCode: emptyRegistraiontsAddress.address.yipCode
}

export const NoAddresses = Template.bind({})
NoAddresses.args = {
  delayMilis: 100,
  userAddressData: [],
  selectedYipCode: null
}

export const Long = Template.bind({})
Long.args = {
  delayMilis: 100,
  userAddressData: [longAddress],
  selectedYipCode: longAddress.address.yipCode
}

export const NoDelay = Template.bind({})
NoDelay.args = {
  delayMilis: 100,
  userAddressData: [homeAddress, workAddress, parentsAddress, noNameAddress, emptyAddress],
  selectedYipCode: workAddress.address.yipCode
}

export const RealisticDelay = Template.bind({})
RealisticDelay.args = {
  delayMilis: 1500,
  userAddressData: [homeAddress, workAddress, parentsAddress, noNameAddress, emptyAddress],
  selectedYipCode: workAddress.address.yipCode
}

export const QuickFail = Template.bind({})
QuickFail.args = {
  delayMilis: 100,
  userAddressData: null,
  selectedYipCode: workAddress.address.yipCode
}

export const MediumLengthFail = Template.bind({})
MediumLengthFail.args = {
  delayMilis: 1500,
  userAddressData: null,
  selectedYipCode: workAddress.address.yipCode
}