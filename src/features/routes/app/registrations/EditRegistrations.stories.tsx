import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { Registration, RegistrationsValidationResult, validateRegistrations } from "../../../../packages/YipStackLib/types/registrations";
import { EditRegistrations, EditRegistrationsProps } from "./EditRegistrations";

type StoryType = typeof StoryWrapper

export default {
    component: EditRegistrations,
    title: 'app/registrations/Edit'
} as ComponentMeta<StoryType>


const arbitraryDate1 = new Date(2020, 12)
const arbitraryDate2 = new Date(2021, 12)
const arbitraryDate3 = new Date(2022, 12)

type EditRegistrationsStoryProps = {
    initialRegistrations: Registration[],
    addressLabel: string
}

const StoryWrapper: React.FC<EditRegistrationsStoryProps> = ({initialRegistrations, addressLabel}) => {
    
    const [registrations, setRegistrations] = useState(initialRegistrations)
    const [validation, setValidation] = useState<RegistrationsValidationResult | null>(null)


    function setAndMaybeValidate(newRegistrations: Registration[]){        
        setRegistrations(newRegistrations)
        if(validation != null){
            revalidate(newRegistrations)
        }
    }

    function submitRegistrations(){
        revalidate(registrations)
    }

    function revalidate(rs: Registration[]){
        const newValidation = validateRegistrations(rs)
        setValidation(newValidation)        
    }

    const childProps: EditRegistrationsProps = {
        addressLabel,
        registrations,
        setRegistrations: setAndMaybeValidate,
        addressLastUpdated: arbitraryDate2,
        validation,
        submitRegistrations
    }

    return <EditRegistrations {...childProps}/>
}

const Template: ComponentStory<StoryType> = (args: EditRegistrationsStoryProps) => <StoryWrapper {...args}/>

export const Standard = Template.bind({})

Standard.args = {
    initialRegistrations: [{name: "Mozilla Developer Website", addressLastUpdated: arbitraryDate1, hyperlink: "https://developer.mozilla.org/"}, {name: "Whistle While you work", addressLastUpdated: arbitraryDate3}, {name: "WorkyMcWorkerson", addressLastUpdated: arbitraryDate2}, {name: "OWASP", addressLastUpdated: arbitraryDate3, hyperlink: "https://owasp.org/"}, {name: "That big teddy bear delivery company", addressLastUpdated: arbitraryDate3}],
    addressLabel: "Work"
}