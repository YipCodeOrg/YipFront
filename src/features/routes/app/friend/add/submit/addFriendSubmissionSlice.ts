import { Friend, isFriend } from "../../../../../../packages/YipStackLib/types/friends/friend"
import { submissionSliceGenerator, SubmissionState } from "../../../../../../util/redux/slices/submissionSlice"
import { createSimpleApiPutThunk, PortBodyThunk } from "../../../../../../util/redux/thunks"

export type AddFriendSubmissionState = SubmissionState<Friend, Friend>
export type AddFriendSubmissionThunk = PortBodyThunk<Friend, Friend>

export const submitAddFriend: AddFriendSubmissionThunk =
    createSimpleApiPutThunk<Friend, Friend>("/friend", isFriend)

export const addFriendSubmissionSliceGenerator = 
    submissionSliceGenerator<Friend, Friend>("addFriend",
        f => f, f => f)

export const addFriendSubmissionSlice = addFriendSubmissionSliceGenerator(submitAddFriend)

export const { clearState } = addFriendSubmissionSlice.actions

export default addFriendSubmissionSlice.reducer