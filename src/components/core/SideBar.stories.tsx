import { ComponentMeta, ComponentStory } from "@storybook/react";
import Sidebar, { SidebarProps } from "./SideBar";
import { FaRegEnvelope, FaPlusCircle } from 'react-icons/fa'

type SideBarType = typeof Sidebar

export default {
    component: Sidebar,
    title: 'components/SideBar',
} as ComponentMeta<SideBarType>

const Template: ComponentStory<SideBarType> = (args: SidebarProps) => <Sidebar {...args}/>

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

