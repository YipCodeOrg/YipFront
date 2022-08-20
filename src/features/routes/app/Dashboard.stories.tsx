import { ComponentMeta, ComponentStory } from "@storybook/react";
import { LoadStatus } from "../../../app/types";
import { Dashboard, DashboardProps } from "./Dashboard";

type DashboardType = typeof Dashboard

enum StoryYipCode {
  Home = "YIP2",
  Work = "YIP4",
  Parents = "YIP1",
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

const homeAddress = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.Home,
  name: "Home",
  address: {
    addressLines: ["123 Fake Street", "Imaginary Road", "Nowhereville", "Nonexistentland", "FUNPOSTCODE123"],
    aliasMap: {
      postCode: 4
    }
  },
  registrations: ["DentalDevils.ie", "HealthInsuranceHeretics.com"]
}

const workAddress = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.Work,
  name: "Work",
  address: {
    addressLines: ["456 Money Lane", "Profit Road", "A longer-than-expected address line which serves to test how the UI handles this case. Some extra characters added here to make it even longer.", "Workland", "BORINGPOSTCODE456"],
    aliasMap: {
      postCode: 4
    }
  },
  registrations: ["HateYourBoss.co.uk", "Whistle While you work", "A longer-than-expected registration description which serves to test what happens the display in this case.", "Bored.of.myjob", "That big teddy bear delivery company"]
}

const parentsAddress = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.Parents,
  name: "Parents",
  address: {
    addressLines: ["890 Memory Lane", "Childhood Road", "Co. Youth", "Youngland", "NOSTALGICPOSTCODE890"],
    aliasMap: {
      postCode: 4
    }
  },
  registrations: ["Childhood School Alumni Club"]
}

const noNameAddress = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.NoName,
  address: {
    addressLines: ["747 Mystery Road", "Bermuda Trianble", "Nowhere"],
    aliasMap: {}
  },
  registrations: []
}

// Tests that the YipCode Input still displays the full YipCode even when there is no address
const emptyAddress = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.EmptyAddress,
  address: {
    addressLines: [],
    aliasMap: {}
  },
  registrations: []
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