import { ComponentMeta, ComponentStory } from "@storybook/react";
import { LoadStatus } from "../../../app/types";
import { UserAddressData } from "../../../packages/YipStackLib/types/userAddressData";
import { Dashboard, DashboardProps } from "./Dashboard";

type DashboardType = typeof Dashboard

enum StoryYipCode {
  Home = "QLC9229ALDN04",
  Work = "FXL82830124",
  Parents = "YY2K1FHAL1",
  NoName = "XY4BSRRB1TU5F9",
  EmptyAddress = "QR6CRPE0TV5G8"
}

export default {
    component: Dashboard,
    title: 'app/routes/Dashboard',
    argTypes: {
      selectedYipCode: {
        options: StoryYipCode
      }
    }
  } as ComponentMeta<DashboardType>

const Template: ComponentStory<DashboardType> = (args: DashboardProps) => <Dashboard {...args}/>

const arbitraryDate = new Date(2022, 12)

const homeAddress: UserAddressData = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.Home,
  name: "Home",
  address: {
    addressLines: ["123 Fake Street", "Imaginary Road", "Nowhereville", "Nonexistentland", "FUNPOSTCODE123"],
    aliasMap: {
      postCode: 4
    }
  },
  registrations: [{name: "DentalDevils.ie", addressLastUpdated: arbitraryDate}, {name: "HealthInsuranceHeretics.com", addressLastUpdated: arbitraryDate}]
}

const workAddress: UserAddressData = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.Work,
  name: "Work",
  address: {
    addressLines: ["456 Money Lane", "Profit Road", "Cashville", "Workland", "BORINGPOSTCODE456"],
    aliasMap: {
      postCode: 4
    }
  },
  registrations: [{name: "Mozilla Developer Website", addressLastUpdated: arbitraryDate, hyperlink: "https://developer.mozilla.org/"}, {name: "Whistle While you work", addressLastUpdated: arbitraryDate}, {name: "WorkyMcWorkerson", addressLastUpdated: arbitraryDate}, {name: "OWASP", addressLastUpdated: arbitraryDate, hyperlink: "https://owasp.org/"}, {name: "That big teddy bear delivery company", addressLastUpdated: arbitraryDate}]
}

const parentsAddress: UserAddressData = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.Parents,
  name: "Parents",
  address: {
    addressLines: ["890 Memory Lane", "Childhood Road", "Co. Youth", "Youngland", "NOSTALGICPOSTCODE890"],
    aliasMap: {
      postCode: 4
    }
  },
  registrations: [{name: "Childhood School Alumni Club", addressLastUpdated: arbitraryDate}]
}

const noNameAddress : UserAddressData = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.NoName,
  address: {
    addressLines: ["747 Mystery Road", "Bermuda Trianble", "Nowhere"],
    aliasMap: {}
  },
  registrations: []
}

// Tests that the YipCode Input still displays the full YipCode even when there is no address
const emptyAddress: UserAddressData = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.EmptyAddress,
  address: {
    addressLines: [],
    aliasMap: {}
  },
  registrations: []
}

const longAddress: UserAddressData = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.Work,
  name: "Work",
  address: {
    addressLines: ["456 Money Lane", "Profit Road", "A longer-than-expected address line which serves to test how the UI handles this case. Some extra characters added here to make it even longer.", "Workland", "BORINGPOSTCODE456"],
    aliasMap: {
      postCode: 4
    }
  },
  registrations: [{name: "HateYourBoss.co.uk", addressLastUpdated: arbitraryDate}, {name: "Whistle While you work", addressLastUpdated: arbitraryDate}, {name: "A longer-than-expected registration description which serves to test what happens the display in this case.", addressLastUpdated: arbitraryDate}, {name: "Bored.of.myjob", addressLastUpdated: arbitraryDate}, {name: "That big teddy bear delivery company", addressLastUpdated: arbitraryDate}, {name: "Another registration", addressLastUpdated: arbitraryDate}, {name: "Another registration", addressLastUpdated: arbitraryDate}, {name: "Another registration", addressLastUpdated: arbitraryDate}, {name: "Another registration", addressLastUpdated: arbitraryDate}, {name: "Another registration", addressLastUpdated: arbitraryDate}, {name: "Another registration", addressLastUpdated: arbitraryDate}, {name: "Another registration", addressLastUpdated: arbitraryDate}, {name: "Another registration", addressLastUpdated: arbitraryDate}, {name: "Another registration", addressLastUpdated: arbitraryDate}, {name: "Another registration", addressLastUpdated: arbitraryDate}, {name: "Another registration", addressLastUpdated: arbitraryDate}]
}

export const Standard = Template.bind({})
Standard.args = {
    userAddressData: [homeAddress, workAddress, parentsAddress, noNameAddress, emptyAddress],
    userAddressDataStatus: LoadStatus.Loaded,
    selectedYipCode: workAddress.yipCode
}

export const Empty = Template.bind({})
Empty.args = {
  userAddressData: [],
  userAddressDataStatus: LoadStatus.Loaded,
  selectedYipCode: null
}

export const Long = Template.bind({})
Long.args = {
  userAddressData: [longAddress],
  userAddressDataStatus: LoadStatus.Loaded,
  selectedYipCode: longAddress.yipCode
}