import { ComponentMeta, ComponentStory } from "@storybook/react"
import { Friend, FriendsValidationResult, validateFriends } from "../../../../packages/YipStackLib/types/friends"
import { ValidateAndSaveProps, ValidateOnSaveAndUpdateWrapper } from "../../../../util/storybook/ValidateAndSaveWrapper"
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
        
    function render(props: ValidateAndSaveProps<Friend, FriendsValidationResult>){

        const { arr: friends, setArr: setFriends, validation, save: saveFriends } = props

        const childProps: AddFriendProps = {
            friends,
            setFriends,
            validation,
            saveFriends
        }    

        return <AddFriend {...childProps}/>
    }

    return <ValidateOnSaveAndUpdateWrapper render={render} initialArr={initialFriends} validate={validateFriends}/>
}

export const Standard = Template.bind({})
Standard.args={
    initialFriends: [{name: "Alice", yipCode: "QLC9229ALDN04"},
    {name: "Daniel Fanjkutic", yipCode: "AO9229ALDN04"},
    {name: "Gauss", yipCode: "FFC9229ALDN04"}]
}