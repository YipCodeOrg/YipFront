import { ComponentMeta, ComponentStory } from "@storybook/react"
import { Friend, FriendsValidationResult, validateFriends } from "../../../../packages/YipStackLib/types/friends"
import { numberToAlpha } from "../../../../util/storybook/storybookHelpers"
import { AppendSingletonValidateRenderProps, AppendSingletonValidateWrapper } from "../../../../util/storybook/ValidateWrapper"
import { AddFriend, AddFriendProps } from "./AddFriend"

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
            save: saveFriends } = props

        const childProps: AddFriendProps = {
            friends: initialFriends,
            setNewFriend: setFriend,
            newFriend: newFriend ?? {name: "", yipCode: ""},
            friendsValidation,
            saveFriends
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

const longFriends = makeLongFriendsArray(300)

export const Long = Template.bind({})
Long.args = {
    initialFriends: longFriends
}

const veryLongFriends = makeLongFriendsArray(3000)

export const VeryLong = Template.bind({})
VeryLong.args = {
    initialFriends: veryLongFriends
}


function longRepeatedFriend(i: number): Friend{
    return {name: `${numberToAlpha(i, 3)}-NAME-${i}`, yipCode: `YIPEEIAY${i}`}    
}

function makeLongFriendsArray(size: number){
    return [...Array(size).keys()].map((_, i) => longRepeatedFriend(i))
}