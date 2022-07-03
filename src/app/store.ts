import { configureStore } from "@reduxjs/toolkit"
import profileReducer from "../features/profile/profileSlice"
import yipcodesReducer from "../features/yipcodes/yipCodesSlice"

const store = configureStore({
    reducer: {
        profile: profileReducer,
        yipCodes: yipcodesReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store