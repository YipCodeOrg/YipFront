import { ComponentMeta, ComponentStory } from "@storybook/react";
import SimpleSidebar, { SimpleSidebarProps, SideBarItemData } from "./SideBar";
import { FaRegEnvelope } from 'react-icons/fa'

type SideBarType = typeof SimpleSidebar

export default {
    component: SimpleSidebar,
    title: 'components/SideBar',
  } as ComponentMeta<SideBarType>

const Template: ComponentStory<SideBarType> = (args: SimpleSidebarProps) => <SimpleSidebar {...args}/>

export const Standard = Template.bind({})
Standard.args = {
    itemData: [{
        name: "item1",
        icon: FaRegEnvelope,
        link: "/dud/link"
    }
    ]
}

