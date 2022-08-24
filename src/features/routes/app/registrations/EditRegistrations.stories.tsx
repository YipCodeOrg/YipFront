import { ComponentMeta, ComponentStory } from "@storybook/react";
import { EditRegistrations, EditRegistrationsProps } from "./EditRegistrations";

type EditRegistrationsType = typeof EditRegistrations

export default {
    component: EditRegistrations,
    title: 'app/registrations/Edit'
} as ComponentMeta<EditRegistrationsType>


const arbitraryDate1 = new Date(2020, 12)
const arbitraryDate2 = new Date(2021, 12)
const arbitraryDate3 = new Date(2022, 12)

const Template: ComponentStory<EditRegistrationsType> = (args: EditRegistrationsProps) => <EditRegistrations {...args}/>

export const Standard = Template.bind({})
Standard.args = {
    registrations: [{name: "Mozilla Developer Website", addressLastUpdated: arbitraryDate1, hyperlink: "https://developer.mozilla.org/"}, {name: "Whistle While you work", addressLastUpdated: arbitraryDate3}, {name: "WorkyMcWorkerson", addressLastUpdated: arbitraryDate2}, {name: "OWASP", addressLastUpdated: arbitraryDate3, hyperlink: "https://owasp.org/"}, {name: "That big teddy bear delivery company", addressLastUpdated: arbitraryDate3}]
}