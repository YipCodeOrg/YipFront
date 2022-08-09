import { ComponentMeta, ComponentStory } from "@storybook/react";
import { LoadStatus } from "../../../app/types";
import { Dashboard, DashboardProps } from "./Dashboard";

type DashboardType = typeof Dashboard

export default {
    component: Dashboard,
    title: 'routes/Dashboard',
  } as ComponentMeta<DashboardType>

const Template: ComponentStory<DashboardType> = (args: DashboardProps) => <Dashboard {...args}/>

const homeAddress = {
  sub: "cognito-sub",
  yipCode: "YIP2",
  name: "Home",
  address: {
    addressLines: ["123 Fake Street, Imaginary Road, Nowhereville, Nonexistentland, FUNPOSTCODE123"],
    aliasMap: {
      postCode: 4
    }
  }
}

const workAddress = {
  sub: "cognito-sub",
  yipCode: "YIP4",
  name: "Work",
  address: {
    addressLines: ["456 Money Lane, Profit Road, Slaveryshire, Workland, BORINGPOSTCODE456"],
    aliasMap: {
      postCode: 4
    }
  }
}

const parentsAddress = {
  sub: "cognito-sub",
  yipCode: "YIP1",
  name: "Parents",
  address: {
    addressLines: ["890 Memory Lane, Childhood Road, Co. Youth, Youngland, NOSTALGICPOSTCODE890"],
    aliasMap: {
      postCode: 4
    }
  }
}

export const Standard = Template.bind({})
Standard.args = {
    userAddressData: [homeAddress, workAddress, parentsAddress],
    userAddressDataStatus: LoadStatus.Loaded,
    selectedYipCode: workAddress.yipCode
}

