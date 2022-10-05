import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import undoable from "redux-undo"
import { Friend } from "../../../../../../packages/YipStackLib/types/friends"
import { UndoActionType } from "../../../../../../util/undo/undoActions"

const initialState: Friend = {
    name: "",
    yipCode: ""
}

export const addFriendEditSlice = createSlice({
    name: "addFriend/edit",
    initialState,
    reducers: {
        setAddFriendEdit(_: Friend, action: PayloadAction<Friend>){
            return action.payload
        }
    }
})

export const { setAddFriendEdit } = addFriendEditSlice.actions

export default undoable(addFriendEditSlice.reducer, {
    undoType: UndoActionType.UndoAddFriend,
    clearHistoryType: UndoActionType.ClearAddFriend
})
