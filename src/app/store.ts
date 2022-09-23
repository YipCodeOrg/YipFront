import { configureStore } from "@reduxjs/toolkit"
import profileReducer from "../features/profile/profileSlice"
import userDataReducer from "../features/userdata/userDataSlice"
import userAddressDataReducer from "../features/useraddressdata/userAddressDataSlice"
import createAddressEditReducer from "../features/routes/app/address/createAddressEditSlice"
import createAddressSubmissionReducer from "../features/routes/app/address/createAddressSubmissionSlice"

const store = configureStore({
    reducer: {
        profile: profileReducer,
        userData: userDataReducer,
        userAddressData: userAddressDataReducer,
        createAddressEdit: createAddressEditReducer,
        createAddressSubmission: createAddressSubmissionReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store