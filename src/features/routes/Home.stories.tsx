import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from '@storybook/addon-actions'
import Home, { HomeProps } from "./Home";

type HomeType = typeof Home

export default {
    component: Home,
    title: 'site/routes/Home',
  } as ComponentMeta<HomeType>

const Template: ComponentStory<HomeType> = (args: HomeProps) => <Home {...args}/>

export const Standard = Template.bind({})
Standard.args = {
    isLoggedIn: true,
    isSignedUp: true,
    setIsSigedUp: (b: boolean) => action("Set is Signed Up")(b)
}
