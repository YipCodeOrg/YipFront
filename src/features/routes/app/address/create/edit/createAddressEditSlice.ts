import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import undoable from "redux-undo"
import { Address, AliasMap } from "../../../../../../packages/YipStackLib/packages/YipAddress/types/address/address"
import { ParseOptions } from "../../../../../../packages/YipStackLib/packages/YipAddress/types/address/parseAddress"
import { UndoActionType } from "../../../../../../util/undo/undoActions"

export type CreateAddressEditState = {
    addressName?: string,
    rawAddress: string,
    parseOptions: ParseOptions,
    address: Address | null
}

type AddressUpdateFunction = (address: Address) => Address

const initialState: CreateAddressEditState = {
    rawAddress: "",
    parseOptions: {},
    address: null
}

export type PayloadWithFallback<T> = {
    obj: T,
    fallbackAddress: Address
}

export const createAddressEditSlice = createSlice({
    name: "createAddress/edit",
    initialState,
    reducers: {
        setRawAddress(state: CreateAddressEditState, action: PayloadAction<string>){
            state.rawAddress = action.payload
        },
        setAddressLines(state: CreateAddressEditState, action: PayloadAction<PayloadWithFallback<string[]>>){                        
            updateAddress(state, function(address){
                return {
                    ...address,
                    addressLines: action.payload.obj
                }
            }, action.payload.fallbackAddress)
        },    
        setAliasMap(state: CreateAddressEditState, action: PayloadAction<PayloadWithFallback<AliasMap>>){
            updateAddress(state, function(address){
                return {
                    ...address,
                    aliasMap: action.payload.obj
                }
            }, action.payload.fallbackAddress)
        },
        setAddressName(state: CreateAddressEditState, action: PayloadAction<string>){
            const name = action.payload
            state.addressName = name
        },
        clearAddress(state: CreateAddressEditState){
            state.address = null
        },
        deleteAddressName(state: CreateAddressEditState){
            delete state.addressName
        }
    }
})

function updateAddress(state: CreateAddressEditState, transform: AddressUpdateFunction, fallBackAddress: Address){                        
    state.address = transformAddress(state, transform, fallBackAddress)
}

function transformAddress(state: CreateAddressEditState, transform: AddressUpdateFunction, fallBackAddress: Address){                        
    const currentAddress = state.address      
    if(currentAddress !== null){
        return transform(currentAddress)
    } else {
        return transform(fallBackAddress)
    }
}

export const { setAddressLines, setAliasMap, setAddressName,
    deleteAddressName, clearAddress, setRawAddress } = createAddressEditSlice.actions


export default undoable(createAddressEditSlice.reducer, {
    undoType: UndoActionType.UndoCreateAddress,
    clearHistoryType: UndoActionType.ClearCreateAddress
})