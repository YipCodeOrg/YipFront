import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Registration, RegistrationsValidationResult, validateRegistrations } from "../../../../packages/YipStackLib/types/registrations";
import { numberToAlpha } from "../../../../util/storybook/storybookHelpers";
import { ListUpdateValidateRenderProps, ListUpdateValidateWrapper } from "../../../../util/storybook/ValidateWrapper";
import { EditRegistrations, EditRegistrationsProps } from "./EditRegistrations";

type StoryType = typeof StoryWrapper

export default {
    component: EditRegistrations,
    title: 'app/registrations/Edit'
} as ComponentMeta<StoryType>


const arbitraryDate1 = new Date(2021, 8)
const arbitraryDate2 = new Date(2021, 12)
const arbitraryDate3 = new Date(2022, 12)

type EditRegistrationsStoryProps = {
    initialRegistrations: Registration[],
    addressLabel: string
}

const StoryWrapper: React.FC<EditRegistrationsStoryProps> = ({initialRegistrations, addressLabel}) => {
    
    
    function render(props: ListUpdateValidateRenderProps<Registration, RegistrationsValidationResult>){

        const { arr: registrations, setArr: setRegistrations, validation, save: saveRegistrations, cancel } = props

        const childProps: EditRegistrationsProps = {
            addressLabel,
            registrations,
            setRegistrations,
            addressLastUpdated: arbitraryDate2,
            validation,
            saveRegistrations,
            cancel
        }    

        return <EditRegistrations {...childProps}/>
    }

    return <ListUpdateValidateWrapper render={render} initialArr={initialRegistrations} validate={validateRegistrations}/>
}

const Template: ComponentStory<StoryType> = (args: EditRegistrationsStoryProps) => <StoryWrapper {...args}/>

export const Standard = Template.bind({})
Standard.args = {
    initialRegistrations: [{name: "Mozilla Developer Website", addressLastUpdated: arbitraryDate1, hyperlink: "https://developer.mozilla.org/"}, {name: "Whistle While you work", addressLastUpdated: arbitraryDate3}, {name: "WorkyMcWorkerson", addressLastUpdated: arbitraryDate2}, {name: "OWASP", addressLastUpdated: arbitraryDate3, hyperlink: "https://owasp.org/"}, {name: "That big teddy bear delivery company", addressLastUpdated: arbitraryDate3}],
    addressLabel: "Work"
}

export const DupeName = Template.bind({})
DupeName.args = {
    initialRegistrations: [{name: "Dupey McDuperson", addressLastUpdated: arbitraryDate1}, {name: "Dupey McDuperson", addressLastUpdated: arbitraryDate2}, {name: "", addressLastUpdated: arbitraryDate3}, {name: "", addressLastUpdated: arbitraryDate1}],
    addressLabel: "Father Ted's House"
}

const longRegistrations = makeLongRegistrationsArray(300)

export const Long = Template.bind({})
Long.args = {
    initialRegistrations: longRegistrations,
    addressLabel: "Long Way from Tip"
}

const veryLongRegistrations = makeLongRegistrationsArray(3000)

export const VeryLong = Template.bind({})
VeryLong.args = {
    initialRegistrations: veryLongRegistrations,
    addressLabel: "Very Long Way from Tip"
}

function longRepeatedRegistration(i: number): Registration{
    return {name: `${numberToAlpha(i, 3)}-NAME-${i}`, addressLastUpdated: new Date(arbitraryDate1.getTime() + 86400000*i),
        hyperlink: `https://${numberToAlpha(i, 3)}-${i}.com`}    
}

function makeLongRegistrationsArray(size: number){
    return [...Array(size).keys()].map((_, i) => longRepeatedRegistration(i))
}