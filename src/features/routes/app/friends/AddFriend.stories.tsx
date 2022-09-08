import { ComponentMeta, ComponentStory } from "@storybook/react"
import { Friend, FriendsValidationResult, validateFriends } from "../../../../packages/YipStackLib/types/friends"
import { AppendSingletonValidateRenderProps, AppendSingletonValidateWrapper } from "../../../../util/storybook/ValidateWrapper"
import AddFriend, { AddFriendProps } from "./AddFriend"

type StoryType = typeof StoryWrapper

export default {
    component: AddFriend,
    title: 'app/friends/add'
  } as ComponentMeta<StoryType>

const Template: ComponentStory<StoryType> = (args: AddFriendStoryProps) => <StoryWrapper {...args}/>

type AddFriendStoryProps = {
    initialFriends: Friend[]
}

function StoryWrapper({initialFriends}: AddFriendStoryProps){
        
    function render(props: AppendSingletonValidateRenderProps<Friend, FriendsValidationResult>){

        const { valToAppend: newFriend, setValToAppend: setFriend, validation: friendsValidation,
            save: saveFriends, cancel: cancelAddFriend } = props

        const childProps: AddFriendProps = {
            friends: initialFriends,
            setNewFriend: setFriend,
            newFriend: newFriend ?? {name: "", yipCode: ""},
            friendsValidation,
            saveFriends,
            cancelAddFriend 
        }    

        return <AddFriend {...childProps}/>
    }

    return <AppendSingletonValidateWrapper render={render} initialArr={initialFriends} validate={validateFriends}
        initialValToAppend={{name: "", yipCode: ""}} />
}

export const Standard = Template.bind({})
Standard.args={
    initialFriends: [{name: "Alice", yipCode: "QLC9229ALDN04"},
    {name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04"},
    {name: "Gauss", yipCode: "FFC9229ALDN04"}]
}