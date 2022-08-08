import { ComponentMeta, ComponentStory } from "@storybook/react";
import SimpleSidebar, { SimpleSidebarProps } from "./SideBar";
import { FaRegEnvelope, FaPlusCircle } from 'react-icons/fa'

type SideBarType = typeof SimpleSidebar

export default {
    component: SimpleSidebar,
    title: 'components/SideBar',
  } as ComponentMeta<SideBarType>

const Template: ComponentStory<SideBarType> = (args: SimpleSidebarProps) => (<SimpleSidebar {...args}/>)

export const Standard = Template.bind({})
Standard.args = {
    itemData: [{
        name: "Home Address",
        icon: FaRegEnvelope,
        link: "/fake/address/home"
    }],
    buttonData: [{
        hoverText: "Add a new Address",
        icon: FaPlusCircle,
        link: "/fake/add"
    }]
}

