import { ComponentMeta, ComponentStory } from "@storybook/react";
import SimpleSidebar, { SimpleSidebarProps } from "./SideBar";
import { FaRegEnvelope } from 'react-icons/fa'
import { GrAddCircle } from 'react-icons/gr';
import { Icon } from "@chakra-ui/react";

type SideBarType = typeof SimpleSidebar

export default {
    component: SimpleSidebar,
    title: 'components/SideBar',
  } as ComponentMeta<SideBarType>

const Template: ComponentStory<SideBarType> = (args: SimpleSidebarProps) => (<SimpleSidebar {...args}>         
    <Icon mr="4" fontSize="16"
        _groupHover={{ color: 'white',}} as={GrAddCircle}/> 
</SimpleSidebar>)

export const Standard = Template.bind({})
Standard.args = {
    itemData: [{
        name: "item1",
        icon: FaRegEnvelope,
        link: "/dud/link"
    }
    ]
}

