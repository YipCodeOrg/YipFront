import { ActionCreatorWithPayload, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { Address, AliasMap } from "../../../../packages/YipStackLib/packages/YipAddress/core/address"
import { ParseOptions } from "../../../../packages/YipStackLib/packages/YipAddress/parse/parseAddress"

type CreateAddressState = {
    addressName?: string,
    parseOptions: ParseOptions,
    address: Address | null
}

type AddressUpdateFunction = (address: Address) => Address

const initialState: CreateAddressState = {
    parseOptions: {},
    address: null
}

export const createAddressSlice = createSlice({
    name: "createAddress",
    initialState: initialState,
    reducers: {
        initialiseAddress(state: CreateAddressState, action: PayloadAction<Address>){
            const oldAddress = state.address
            if(oldAddress === null){
                state.address = action.payload
            } else {
                throw new Error("Can't initialise address - address is already initialised")
            }
        },
        setAddressLines(state: CreateAddressState, action: PayloadAction<string[]>){
            updateAddress(state, function(address){
                return {
                    ...address,
                    addressLines: action.payload
                }
            })
        },    
        setAliasMap(state: CreateAddressState, action: PayloadAction<AliasMap>){
            updateAddress(state, function(address){
                return {
                    ...address,
                    aliasMap: action.payload
                }
            })
        },
        setAddressName(state: CreateAddressState, action: PayloadAction<string>){
            const name = action.payload
            state.addressName = name
        },
        deleteAddressName(state: CreateAddressState){
            delete state.addressName
        }
    }
})

export const { initialiseAddress, setAddressLines,
    setAliasMap, setAddressName, deleteAddressName } = createAddressSlice.actions

export const selectCreateAddress = (state: RootState) => state.createAddress

export const useCreateAddressState = () : CreateAddressState => {
    const addressState = useAppSelector(selectCreateAddress)
    return addressState
}

export const useCurrentCreateAddress = () : Address | null => {
    const addressState = useCreateAddressState()
    return addressState.address
}

type CreateAddressNameState = {
    name: string | undefined,
    setName: (n: string) => void,
    deleteName: () => void
}

export function useCreateAddressName(): CreateAddressNameState{
    const addressState = useCreateAddressState()
    const dispatch = useAppDispatch()
    const setCallback = useCallback((name: string) => dispatch(setAddressName(name)), [dispatch])
    const deleteCallback = useCallback(() => dispatch(deleteAddressName()), [dispatch])
    return {
        name: addressState.addressName,
        setName: setCallback,
        deleteName: deleteCallback
    }
}

export function useUpdateCreateAddressLines() : (updater: (lines: string[]) => void) => void{
    return useUpdateAddressAndDispatch(setAddressLines, a => a.addressLines)
}

export function useUpdateCreateAddressAliasMap() : (updater: (aliases: AliasMap) => void) => void{
    return useUpdateAddressAndDispatch(setAliasMap, a => a.aliasMap)
}

function useUpdateAddressAndDispatch<T>(payloadCreator: ActionCreatorWithPayload<T>,
    propCopy: (a: Address) => T){
    const dispatch = useAppDispatch()
    const currentAddressState = useCurrentCreateAddress()
    
    function callBackFunction(updater: (t: T) => void){
        if(currentAddressState === null){
            throw new Error("Current address is null - cannot update");        
        }    
        const newProp = propCopy(currentAddressState)
        updater(newProp)
        return dispatch(payloadCreator(newProp))
    }

    const callback = useCallback(callBackFunction, [dispatch, currentAddressState])
    return callback
}

export default createAddressSlice.reducer

function updateAddress(state: CreateAddressState, update: AddressUpdateFunction){                        
    const currentAddress = state.address
    if(currentAddress === null){
        throw new Error("Cannot update address - it has not been initialised");        
    }
    const newAddress = update(currentAddress)
    state.address = newAddress
}