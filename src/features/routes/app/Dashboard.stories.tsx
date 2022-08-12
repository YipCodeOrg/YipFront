import { ComponentMeta, ComponentStory } from "@storybook/react";
import { LoadStatus } from "../../../app/types";
import { Dashboard, DashboardProps } from "./Dashboard";

type DashboardType = typeof Dashboard

enum StoryYipCode {
  Home = "YIP2",
  Work = "YIP4",
  Parents = "YIP1",
  NoName = "XY4BSRRB1TU5F9"
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
  }
}

const workAddress = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.Work,
  name: "Work",
  address: {
    addressLines: ["456 Money Lane", "Profit Road", "Ninetofiveshire", "Workland", "BORINGPOSTCODE456"],
    aliasMap: {
      postCode: 4
    }
  }
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
  }
}

const noNameAddress = {
  sub: "cognito-sub",
  yipCode: StoryYipCode.NoName,
  address: {
    addressLines: ["747 Mystery Road", "Bermuda Trianble", "Nowhere"],
    aliasMap: {}
  }
}

export const Standard = Template.bind({})
Standard.args = {
    userAddressData: [homeAddress, workAddress, parentsAddress, noNameAddress],
    userAddressDataStatus: LoadStatus.Loaded,
    selectedYipCode: workAddress.yipCode
}

export const Empty = Template.bind({})
Empty.args = {
  userAddressData: [],
  userAddressDataStatus: LoadStatus.Loaded,
  selectedYipCode: null
}