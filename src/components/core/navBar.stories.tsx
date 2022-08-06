import { ComponentMeta, ComponentStory } from "@storybook/react";
import { BrowserRouter} from "react-router-dom";
import { NavBar, NavbarProps } from "./NavBar";

type NavBarType = typeof NavBar

export default {
  component: NavBar,
  title: 'core/NavBar',
} as ComponentMeta<NavBarType>;

const Template: ComponentStory<NavBarType> = (args: NavbarProps) => <BrowserRouter><NavBar {...args}/></BrowserRouter>

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