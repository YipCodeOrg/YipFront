import { AsyncThunk } from "@reduxjs/toolkit";
import { useAsyncHubFetch } from "../../app/hooks";
import { UserData } from "../../packages/YipStackLib/types/userData";
import { selectUserDataSlice } from "./userDataSelectors";

export const useUserDataHubFetch = (thunk: AsyncThunk<UserData, MessagePort, {}>) => useAsyncHubFetch(thunk, selectUserDataSlice)  