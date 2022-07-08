import { AsyncThunk } from '@reduxjs/toolkit'
import { useContext, useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { HUB_ORIGIN_URL } from '../util/misc'
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

export function useHubHandshake(){

    const [toHubPort, setToHubPort] = useState<MessagePort | null>(null)

    const listenOnceForHubReady: React.EffectCallback = () => {
        
        const allowedMessage = "readyToListen"

        function handleReadyMessage(event: MessageEvent<any>){
            if (event.origin !== HUB_ORIGIN_URL) {
                //Note: we don't throw an exception here because there are other listeners that process messages from other origins
                //For example, there seems to be web socket messages from self.origin when running this with NPM locally
                return;
            }
            const data = event.data
            if(!(typeof data === 'string' || data instanceof String) || data !== allowedMessage){            
                throw new Error("Invalid message format received from Hub prior to readyToListen message.")
            }
            const port = event.ports[0]      
            setToHubPort(port)
            //Removes itself once it's done its job
            window.removeEventListener("message", handleReadyMessage);            
        }

        window.addEventListener("message", handleReadyMessage);
    };

    useEffect(listenOnceForHubReady, []);

    return toHubPort
}