import { ComponentMeta, ComponentStory } from "@storybook/react";
import { LoadStatus } from "../../../app/types";
import { Dashboard, DashboardProps } from "./Dashboard";

type DashboardType = typeof Dashboard

export default {
    component: Dashboard,
    title: 'routes/Dashboard',
  } as ComponentMeta<DashboardType>

const Template: ComponentStory<DashboardType> = (args: DashboardProps) => <Dashboard {...args}/>

const userData= {
  sub: "cognito-sub",
  data: {
      yipCodes: ["YIP1", "YIP2", "YIP3"]
  }
}

const userAddressData1 = {
  sub: "cognito-sub",
  yipCode: "YIP1",
  address: {
    addressLines: ["123 Fake Street, Imaginary Road, Nowhereville, Nonexistentland, FUNPOSTCODE123"],
    aliasMap: {
      postCode: 4
    }
  }
}

export const Standard = Template.bind({})
Standard.args = {
    userData: userData,
    userDataStatus: LoadStatus.Loaded,
    userAddressData: [userAddressData1],
    userAddressDataStatus: LoadStatus.Loaded
}

