import { ComponentMeta, ComponentStory } from "@storybook/react";
import { NavBar, NavbarProps } from "./NavBar";

type NavBarType = typeof NavBar

export default {
  component: NavBar,
  title: 'components/NavBar',
} as ComponentMeta<NavBarType>

const Template: ComponentStory<NavBarType> = (args: NavbarProps) => <NavBar {...args}/>

function noOp(){}

export const Primary = Template.bind({})
Primary.args = {
    isOpen: true,
    onOpen: noOp,
    onClose: noOp,
    onToggle: noOp,
    isLoggedIn: true,
    isSignedUp: true,
    setIsSigedUp: noOp
}