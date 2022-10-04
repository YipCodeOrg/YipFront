import { configureStore } from "@reduxjs/toolkit"
import profileReducer from "../features/profile/profileSlice"
import userDataReducer from "../features/userdata/userDataSlice"
import userAddressDataReducer from "../features/useraddressdata/userAddressDataSlice"
import createAddressEditReducer from "../features/routes/app/address/create/edit/createAddressEditSlice"
import createAddressSubmissionReducer from "../features/routes/app/address/create/submit/createAddressSubmissionSlice"
import addFriendSubmissionReducer from "../features/routes/app/friend/add/submission/addFriendSubmissionSlice"

const store = configureStore({
    reducer: {
        profile: profileReducer,
        userData: userDataReducer,
        userAddressData: userAddressDataReducer,
        createAddressEdit: createAddressEditReducer,
        createAddressSubmission: createAddressSubmissionReducer,
        addFriendSubmission: addFriendSubmissionReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store