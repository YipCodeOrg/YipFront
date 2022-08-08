import { ComponentMeta, ComponentStory } from "@storybook/react";
import { LoadStatus } from "../../../app/types";
import { Dashboard, DashboardProps } from "./Dashboard";

type DashboardType = typeof Dashboard

export default {
    component: Dashboard,
    title: 'routes/Dashboard',
  } as ComponentMeta<DashboardType>

const Template: ComponentStory<DashboardType> = (args: DashboardProps) => <Dashboard {...args}/>

export const NotLoaded = Template.bind({})
NotLoaded.args = {
    userData: undefined,
    userDataStatus: LoadStatus.NotLoaded,
    userAddressData: undefined,
    userAddressDataStatus: LoadStatus.NotLoaded
}

