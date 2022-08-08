import { ComponentMeta, ComponentStory } from "@storybook/react";
import SimpleSidebar from "./SideBar";

type SideBarType = typeof SimpleSidebar

export default {
    component: SimpleSidebar,
    title: 'components/SideBar',
  } as ComponentMeta<SideBarType>

const Template: ComponentStory<SideBarType> = () => <SimpleSidebar/>

export const Standard = Template.bind({})

