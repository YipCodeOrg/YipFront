import { configureStore } from "@reduxjs/toolkit"
import profile from "../features/profile/profileSlice"
import userData from "../features/userdata/userDataSlice"
import userAddressData from "../features/useraddressdata/userAddressDataSlice"
import createAddressEdit from "../features/routes/app/address/create/edit/createAddressEditSlice"
import createAddressSubmission from "../features/routes/app/address/create/submit/createAddressSubmissionSlice"
import addFriendSubmission from "../features/routes/app/friend/add/submit/addFriendSubmissionSlice"
import friends from "../features/routes/app/friends/friendsSlice"
import addFriendEdit from "../features/routes/app/friend/add/edit/addFriendEditSlice"
import editRegistrationsSubmission from "../features/routes/app/registrations/submit/editRegistrationsSubmissionSlice"

const store = configureStore({
    reducer: {
        profile,
        userData: userData,
        userAddressData,
        createAddressEdit,
        createAddressSubmission,
        addFriendSubmission,
        friends,
        addFriendEdit,
        editRegistrationsSubmission
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store