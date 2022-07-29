import { configureStore } from "@reduxjs/toolkit"
import profileReducer from "../features/profile/profileSlice"
import userDataReducer from "../features/userdata/userDataSlice"
import userAddressDataReducer from "../features/useraddressdata/userAddressDataSlice"

const store = configureStore({
    reducer: {
        profile: profileReducer,
        userData: userDataReducer,
        userAddressData: userAddressDataReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store