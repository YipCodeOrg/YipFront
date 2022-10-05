import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks"
import { Friend } from "../../../../../../packages/YipStackLib/types/friends"
import { selectAddFriendState } from "./addFriendEditSelectors"
import { setAddFriendEdit } from "./addFriendEditSlice"

export type AddFriendEditHookReturn = {
    friend: Friend,
    setFriend: (f: Friend) => void
}

export const useAddFriendEdit = () : AddFriendEditHookReturn => {
    const friendState = useAppSelector(selectAddFriendState)
    const dispatch = useAppDispatch()
    const setCallback = useCallback((f: Friend) => dispatch(setAddFriendEdit(f)), [dispatch])
    return {
        friend: friendState.present,
        setFriend: setCallback
    }
}