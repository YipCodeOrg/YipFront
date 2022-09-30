import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { isUserData, UserData } from "../../packages/YipStackLib/types/userData";
import { fetchSliceGenerator, FetchSliceOf } from "../../util/redux/slices/fetchSlice";
import { createSimpleApiGetThunk } from "../../util/redux/thunks";
import { deleteAddress, DeleteAddressThunk } from "../useraddressdata/userAddressDataSlice";
import { compose2 } from "../../packages/YipStackLib/packages/YipAddress/util/misc";

export type UserDataState = FetchSliceOf<UserData>

export const userDataSliceGenerator = compose2(
    deletionBuilderUpdater,
    fetchSliceGenerator<UserData, UserData>("userData", d => d, "/userdata", isUserData)
)

function deletionBuilderUpdater(thunk: DeleteAddressThunk){
    return function(builder: ActionReducerMapBuilder<UserDataState>){
        builder.addCase(thunk.fulfilled, (state, action) => {
            const yipCode = action.meta.arg.body.yipCode
            handleYipCodeUpdate(state, yipCode, function(data, index){
                data.data.yipCodes.splice(index, 1)
            })
        })
        return builder
    }
}

function handleYipCodeUpdate(state: UserDataState, yipCode: string, 
    handler: (data: UserData, index: number) => void){    
    const index = findIndexByYipCode(state, yipCode)
    const data = state.sliceData            
    if(data !== undefined){
        handler(data, index)
    }       
}

function findIndexByYipCode(state: UserDataState, yipCode: string): number {
    const yipCodes = state.sliceData?.data.yipCodes
    if(yipCodes === undefined){
        return -1
    }
    const index = yipCodes.findIndex(y => y === yipCode)
    return index
}

export const { slice: userDataSlice, thunk: fetchUserData } = userDataSliceGenerator(deleteAddress)(createSimpleApiGetThunk)

export default userDataSlice.reducer