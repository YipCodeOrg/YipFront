import { AsyncThunk } from '@reduxjs/toolkit'
import { useContext, useEffect } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { HubPortContext } from './App'
import type { RootState, AppDispatch } from './store'
import { LoadStatus } from './types'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAsyncHubLoad:

    <TReturn>(
    thunk: AsyncThunk<TReturn, MessagePort, {}>,
    dataSelector: (state: RootState) => TReturn,
    statusSelector: (state: RootState) => LoadStatus) => [TReturn, LoadStatus]
    
    = <TReturn>(
    thunk: AsyncThunk<TReturn, MessagePort, {}>,
    dataSelector: (state: RootState) => TReturn,
    statusSelector: (state: RootState) => LoadStatus) => {        
        const status = useAppSelector(statusSelector)
        const data = useAppSelector(dataSelector)
        const hubPort = useContext(HubPortContext)
        const dispatch = useAppDispatch()

        useEffect(
            () => {
                if(!!hubPort && status === LoadStatus.NotLoaded){
                    dispatch(thunk(hubPort))
                }
            }
            ,
            [hubPort, status, dispatch, thunk]
        )

        return [data, status]
}