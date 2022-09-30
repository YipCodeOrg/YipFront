import { useAsyncHubFetch } from "../../app/hooks";
import { selectIsLoggedInSlice } from "./profileSelectors";
import { fetchLoginState } from "./profileSlice";

export const useLoginHubFetch = () => useAsyncHubFetch(fetchLoginState, selectIsLoggedInSlice)  