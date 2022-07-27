import { configureStore } from "@reduxjs/toolkit"
import profileReducer from "../features/profile/profileSlice"
import userDataReducer from "../features/userdata/userDataSlice"

const store = configureStore({
    reducer: {
        profile: profileReducer,
        userData: userDataReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store