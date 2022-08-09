import { ComponentMeta, ComponentStory } from "@storybook/react";
import Sidebar, { SimpleSidebarProps } from "./SideBar";
import { FaRegEnvelope, FaPlusCircle } from 'react-icons/fa'

type SideBarType = typeof Sidebar

export default {
    component: Sidebar,
    title: 'components/SideBar',
  } as ComponentMeta<SideBarType>

const Template: ComponentStory<SideBarType> = (args: SimpleSidebarProps) => (<Sidebar {...args}/>)

export const Standard = Template.bind({})
Standard.args = {
    itemData: [{
        key: "home",
        name: "Home Address",
        icon: FaRegEnvelope,
        link: "/fake/address/home"
    }],
    buttonData: [{
        hoverText: "Add a new Address",
        icon: FaPlusCircle,
        link: "/fake/add"
    }],
    selectedItemKey: "home"
}

