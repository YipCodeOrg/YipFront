import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";
import { Registration } from "../../../../packages/YipStackLib/types/userAddressData";
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

    const handleRegsitrationChange = (index: number) => 
        (change: (r : Registration) => Registration) => 
    {
        const registrationToChange = registrations[index]
        if(!!registrationToChange){
            const updatedRegistration = change(registrationToChange)
            const newRegistrations = [...registrations]
            newRegistrations[index] = updatedRegistration
            setRegistrations(newRegistrations)
        }
        else{
            throw new Error("Problem getting registration at index");            
        }
    }

    const childProps: EditRegistrationsProps = {
        addressLabel,
        registrations,
        handleRegsitrationChange
    }

    return <EditRegistrations {...childProps}/>
}

const Template: ComponentStory<StoryType> = (args: EditRegistrationsStoryProps) => <StoryWrapper {...args}/>

export const Standard = Template.bind({})
Standard.args = {
    initialRegistrations: [{name: "Mozilla Developer Website", addressLastUpdated: arbitraryDate1, hyperlink: "https://developer.mozilla.org/"}, {name: "Whistle While you work", addressLastUpdated: arbitraryDate3}, {name: "WorkyMcWorkerson", addressLastUpdated: arbitraryDate2}, {name: "OWASP", addressLastUpdated: arbitraryDate3, hyperlink: "https://owasp.org/"}, {name: "That big teddy bear delivery company", addressLastUpdated: arbitraryDate3}],
    addressLabel: "Work"
}