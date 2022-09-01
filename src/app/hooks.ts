import { AsyncThunk } from '@reduxjs/toolkit'
import { useContext, useEffect, useRef, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { HUB_ORIGIN_URL } from '../util/misc'
import { HubContext } from './App'
import type { RootState, AppDispatch } from './store'
import { LoadStatus } from './types'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type FilterResult<T> = {
    filtered: T[],
    applyFilter: (f: (t: T) => boolean) => void,
    clearFilter: () => void
}

export function useFilter<T>(ts: T[]): FilterResult<T>{
    const [filtered, setFiltered] = useState(ts)

    useEffect(() => {
        setFiltered(ts)
    }, [ts])

    function applyFilter(f: (t: T) => boolean){
        setFiltered(ts.filter(f))
    }

    function clearFilter(){
        setFiltered(ts)
    }

    return {filtered, applyFilter, clearFilter}
}

export function useAsyncHubLoad<TReturn>(
    thunk: AsyncThunk<TReturn, MessagePort, {}>,
    dataSelector: (state: RootState) => TReturn | undefined,
    statusSelector: (state: RootState) => LoadStatus) : [TReturn | undefined, LoadStatus]{        
        const status = useAppSelector(statusSelector)
        const data = useAppSelector(dataSelector)
        const [hubPort] = useContext(HubContext)
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

function useTimeoutState<TState>(timeoutAction: () => void, timeoutMs: number) :
    [TState | null, React.Dispatch<React.SetStateAction<TState | null>>]
    {
    const [state, setState] = useState<TState | null>(null)
    const timeoutId = useRef<NodeJS.Timeout | null >(null)

    useEffect(() => {

        function clearTimeoutIfExists(){
            if(!!timeoutId.current){
                clearTimeout(timeoutId.current);
            }
        }

        function setTimeoutIfNull(){
            if(!timeoutId.current){
                const id = setTimeout(timeoutAction, timeoutMs)
                timeoutId.current = id
            }
        }

        if(!state){
            setTimeoutIfNull()
        } else {
            clearTimeoutIfExists()
        }
    }, [state, timeoutId, timeoutAction, timeoutMs])

    return [state, setState]
}

export function useHubHandshake() : [MessagePort | null, boolean]{

    const [toHubPort, setToHubPort] = useTimeoutState<MessagePort | null>(handleHandshakeTimeout, 1000)
    const [isHubLoadError, setIsHubLoadError] = useState(false)

    function handleHandshakeTimeout(){
        console.error("Hub handshake failed to be established in the expected time.")
        setIsHubLoadError(true)
    }
    
    useEffect(() => {
        
        const handleListeningMessage = (port: MessagePort) => (event: MessageEvent<any>) => {
            const allowedMessage = "listening"   
            const data = event.data
            if(!(typeof data === 'string' || data instanceof String) || data !== allowedMessage){            
                throw new Error("Invalid message format received from Hub prior to listening message.")
            }
            console.log("...Received listening status from Hub. Saving port for further communication.")
            setToHubPort(port)
            setIsHubLoadError(false)
        }

        function handleReadyMessage(event: MessageEvent<any>){
            const allowedMessage = "readyToListen"   
            if (event.origin !== HUB_ORIGIN_URL) {
                //Note: we don't throw an exception here because there are other listeners that process messages from other origins
                //For example, there seems to be web socket messages from self.origin when running this with NPM locally
                return;
            }
            const data = event.data
            if(!(typeof data === 'string' || data instanceof String) || data !== allowedMessage){            
                throw new Error("Invalid message format received from Hub prior to readyToListen message.")
            }        
            console.log("...Received status: Hub ready to listen.")
            setToHubPort(null)
            const handshakePort = event.ports[0]
            if(!handshakePort){
                throw new Error("No handshake port received. Cannot continue handshake.")
            }
            const permanentChannel = new MessageChannel()
            const myPort = permanentChannel.port1
            const hubPort = permanentChannel.port2
            console.log("Telling Hub to listen...")
            handshakePort.postMessage({label: "listen"}, [hubPort])
            myPort.onmessage = handleListeningMessage(myPort)
        }

        window.addEventListener("message", handleReadyMessage)
        return function(){
            window.removeEventListener("message", handleReadyMessage);
        }

        /*Non-MVP: Consider adding logic here that detects a second "ready to listen" message fro Hub.
        In that case, we should warn Hub that something unexpected has happened and tell it something has gone wrong.
        Hub should then act accordingly and shut down any of its own liseners.
        */

    }, [setToHubPort]);

    return [toHubPort, isHubLoadError]
}