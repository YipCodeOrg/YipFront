import { AsyncThunk } from '@reduxjs/toolkit'
import { useContext, useEffect, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { HUB_ORIGIN_URL } from '../util/misc'
import { HubContext } from './App'
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
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null >(null)

    function clearTimeoutIfExists(){
        if(!!timeoutId){
            clearTimeout(timeoutId);
            setTimeoutId(null)
        }
    }

    useEffect(() => {
        if(!state){
            setTimeoutId(setTimeout(timeoutAction, timeoutMs));
        } else {
            clearTimeoutIfExists()
        }
        return clearTimeoutIfExists
    }, [state, timeoutId])

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
            if(!!toHubPort){
                console.error("Listening message received when to Hub Port already set. Sending error to Hub.")
                port.postMessage("handshakeError")
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
            const tempPort = event.ports[0]
            const permanentChannel = new MessageChannel()
            const myPort = permanentChannel.port1
            const hubPort = permanentChannel.port2
            console.log("Telling Hub to listen...")
            tempPort.postMessage({label: "listen"}, [hubPort])
            myPort.onmessage = handleListeningMessage(myPort)
        }

        window.addEventListener("message", handleReadyMessage)
        return function(){
            window.removeEventListener("message", handleReadyMessage);
        }
    }, [toHubPort]);

    return [toHubPort, isHubLoadError]
}