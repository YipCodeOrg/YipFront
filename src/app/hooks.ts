import { ActionCreatorWithoutPayload, AsyncThunk } from '@reduxjs/toolkit'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { Indexed } from '../packages/YipStackLib/packages/YipAddress/util/types'
import { EnhancedValidation, lazyEnhancedValidationOrNull } from '../packages/YipStackLib/packages/YipAddress/validate/ehancedValidation'
import { ValidationResult } from '../packages/YipStackLib/packages/YipAddress/validate/validation'
import { HUB_ORIGIN_URL } from '../util/misc'
import { FetchSliceOf } from '../util/redux/slices/fetchSlice'
import { SubmissionState, SubmissionStatus } from '../util/redux/slices/submissionSlice'
import { PortBodyThunkInput } from '../util/redux/thunks'
import { HubContext, HubContextType } from './App'
import type { RootState, AppDispatch } from './store'
import { LoadStatus } from './types'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export function useSubmissionRetry<TSubmit, TResponse>(useSubmissionHook: () => SubmissionState<TSubmit, TResponse>,
useClearSubmissionHook: () => () => void, submit: (s: TSubmit) => void): () => void{
    const state = useSubmissionHook()    
    const clear = useClearSubmissionHook()

    const retrySubmission = useCallback(function (){
        const { submitted } = state
        if(submitted !== null){
            clear()
            submit(submitted)
        }
    }, [state, clear, submit])

    return retrySubmission
}

export function useActionWithoutPayload<T extends string>(creator: ActionCreatorWithoutPayload<T>){
    const dispatch = useAppDispatch()
    const callback = useCallback(function(){
        dispatch(creator())
    }, [dispatch, creator])
    return callback
}

export function useLazyMemo<T>(init: () => T): () => T{
    const [cached, setCached] = useState<T | null>(null)

    function getValue(){
        if(cached !== null){
            return cached
        } else {
            const val = init()
            setCached(val)
            return val
        }
    }

    const callBack = useCallback(getValue, [cached, setCached, init])

    return callBack
}

export function useEnhancedValidation(validation: ValidationResult | null): EnhancedValidation | null{
    const enhanced = useMapped(validation, lazyEnhancedValidationOrNull)
    return enhanced
}

type UseValidationResult<TValid> = {
    validation: TValid | null,
    enhancedValidation: EnhancedValidation | null,
    updateValidation: () => ValidationResult
}

export function useValidation<T, TValid>(getLatestData: () => T, validate: (t: T) => TValid,
    getValidation: (v: TValid) => ValidationResult, updateDependencies: any[]): UseValidationResult<TValid>{
    
    const [validation, setValidation] = useState<TValid | null>(null)
    const validationResult = useMapped(validation, getValidationOrNull)
    const enhanced = useEnhancedValidation(validationResult)

    function getValidationOrNull(v: TValid | null){
        if(v === null){
            return null
        }
        return getValidation(v)
    }

    function validateLatestData(): TValid{
        const data = getLatestData()
        const validation = validate(data)
        return validation
    }

    function updateValidation(){
        const latestValidation = validateLatestData()
        setValidation(latestValidation)
        return getValidation(latestValidation)
    }

    function updateValidationIfNotNull(){
        if(validation !== null){
            updateValidation()
        }
    }

    const updateNotNullCallback =
        useCallback(updateValidationIfNotNull, [validation, setValidation, validateLatestData])

    useEffect(function(){
        updateNotNullCallback()
    }, [setValidation, ...updateDependencies])

    return {
        validation,
        enhancedValidation: enhanced,
        updateValidation
    }
}

export type PaginationResult<T> = {
    currentItems: T[],
    pageCount: number,
    selectedPage: number,
    itemOffset: number,
    handlePageClick: (event: { selected: number }) => void
}

export function usePagination<T>(itemsPerPage: number, data: T[],
    resetOnDataChange: boolean) : PaginationResult<T>{

    const [currentItems, setCurrentItems] = useState<T[]>([])
    const [pageCount, setPageCount] = useState(0)
    const [itemOffset, setItemOffset] = useState(0)
    const [selectedPage, setSelectedPage] = useState(0)

    useEffect(() => { 
        const endOffset = itemOffset + itemsPerPage
        setCurrentItems(data.slice(itemOffset, endOffset))
        setPageCount(Math.ceil(data.length / itemsPerPage))
      }, [itemOffset, itemsPerPage, data])

      useEffect(() => {
        if(resetOnDataChange){
            setSelectedPage(0)
            setItemOffset(0)
        }
      }, [data, setSelectedPage, setItemOffset])

    const handlePageClick = (event: { selected: number }) => {
        const newPage = event.selected 
        const newOffset = newPage * itemsPerPage % data.length        
        setItemOffset(newOffset)
        setSelectedPage(newPage)
    }

    return {
        currentItems,
        pageCount,
        selectedPage,
        itemOffset,
        handlePageClick
    }
}

export type DisclosureResult = {
    isOpen: boolean,
    setOpen: () => void,
    setClosed: () => void
}

export type DisclosuresResult = {
    disclosures: DisclosureResult[],
    setAllOpen: () => void,
    setAllClosed: () => void
}

export function useDisclosures<T>(t: T[]): DisclosuresResult{
    const [isOpenArr, setIsOpenArr] = useMutableMapped<T[], boolean[]>(
        t, u => u.map(_ => false))

    const setOpen = useCallback(function(i: number){
        if(i < isOpenArr.length){
            const newIsOpenArr = [...isOpenArr]
            newIsOpenArr[i] = true
            setIsOpenArr(newIsOpenArr)
        }
    }, [isOpenArr, setIsOpenArr])
    
    const setClosed = useCallback(function(i: number){
        if(i < isOpenArr.length){
            const newIsOpenArr = [...isOpenArr]
            newIsOpenArr[i] = false
            setIsOpenArr(newIsOpenArr)
        }
    }, [isOpenArr, setIsOpenArr])
    
    const setAllOpen = useCallback(function(){
        setIsOpenArr(isOpenArr.map(_ => true))
    }, [isOpenArr, setIsOpenArr])
    
    const setAllClosed = useCallback(function(){
        setIsOpenArr(isOpenArr.map(_ => false))    
    }, [isOpenArr, setIsOpenArr])

    const disclosures: DisclosureResult[] = useMapped(isOpenArr, (arr) => {
        return arr.map((b, i) => {
            return {
                isOpen: b,
                setOpen: () => setOpen(i),
                setClosed: () => setClosed(i)
            }
        })
    })

    return {
        disclosures,
        setAllOpen,
        setAllClosed
    }
}

/** Like useState, but the value t can be forced to overwrite the state at any time. */
export function useForceable<T>(t: T)
: [T, (t: T) => void]{    
    return useMutableMapped(t, u => u)
}

export function useMutableMapped<T, TRet>(t: T, f: (u: T) => TRet)
: [TRet, (t: TRet) => void]{
    const [ret, setRet] = useState<TRet>(() => f(t))

    useEffect(() => {
        setRet(f(t))
    }, [setRet, t])

    return [ret, setRet]
}

export function useMapped<T, TRet>(t: T, f: (u: T) => TRet){
    const [ret, _] = useMutableMapped(t, f)
    return ret
}

export type IndexFilterResult<T> = {
    preFiltered: Indexed<T>[],
    setPreFiltered: (ts: Indexed<T>[]) => void,
    filtered: Indexed<T>[],
    applyFilter: (f: (t: T, i: number) => boolean) => void,
    clearFilter: () => void,    
}

type IndexFilterFunction<T> = {
    func: (t: T, i: number) => boolean
}

export function useIndexFilter<T>(ts: T[]): IndexFilterResult<T>{

    const [preFiltered, setPreFiltered] = useMutableIndexed(ts)

    const [filtered, setFiltered] = useState(preFiltered)

    const [filter, setFilter] = useState<IndexFilterFunction<T>>({func: (_: T, __: number) => true})

    function convertFilter(g: IndexFilterFunction<T>): (ind: Indexed<T>) => boolean{
        return function(ind: Indexed<T>){
            return g.func(ind.obj, ind.index)
        }
    }

    useEffect(() => {
        setFiltered(preFiltered.filter(convertFilter(filter)))
    }, [preFiltered])

    function applyFilter(f: (t: T, i: number) => boolean){
        const newFilter = {func: f}
        setFiltered(preFiltered.filter(convertFilter(newFilter)))
        setFilter(newFilter)
    }

    function clearFilter(){
        setFiltered(preFiltered)
        setFilter({func: (_: T) => true})
    }

    return {filtered, applyFilter, clearFilter, preFiltered, setPreFiltered}
}

export function useMutableIndexed<T>(ts: T[]): [Indexed<T>[], (t: Indexed<T>[]) => void]{
    const [indexed, setIndexed] = useMutableMapped<T[], Indexed<T>[]>(
        ts, (u: T[]) => u.map((t, i) => {return {obj: t, index: i}}))
    
        return [indexed, setIndexed]
}

/**
 * Gets the fetch slice defined by the given selector, and, if the slice is not loaded, dispatches the thunk.
 * @param thunk Encapsulates the logic for asynchronously fetching the object.
 * @param selector Maps the root state to the slice of state we are fetching.
 * @returns The fetch slice's state. Note, if the given thunk was dispatched, the fetch slice will change as the thunk progresses.
 */
export function useAsyncHubFetch<T>(
    thunk: AsyncThunk<T, MessagePort, {}>,
    selector: (state: RootState) => FetchSliceOf<T>) : FetchSliceOf<T>{        
        const data = useAppSelector(selector)
        const { loadStatus } = data
        const { port: hubPort } = useContext(HubContext)
        const dispatch = useAppDispatch()

        useEffect(
            () => {
                if(!!hubPort && loadStatus === LoadStatus.NotLoaded){
                    dispatch(thunk(hubPort))
                }
            }
            ,
            [hubPort, loadStatus, dispatch, thunk]
        )

        return data
}

export function useSubmissionThunkDispatch<TSubmit, TResponse>(
    thunk: AsyncThunk<TResponse, PortBodyThunkInput<TSubmit>, {}>,
    selector: (state: RootState) => SubmissionState<TSubmit, TResponse>,
    shouldCheckClear: boolean = true){
        const dispatch = useAppDispatch()      
        const data = useAppSelector(selector)
        const { status } = data
        const { port: hubPort } = useContext(HubContext)

        const submitCallback = useCallback(function(data: TSubmit){
            if(!!hubPort && (!shouldCheckClear || status === SubmissionStatus.Clear)){
                dispatch(thunk({port: hubPort, body: data}))
            }
        },
            [hubPort, status, dispatch, thunk]
        )

        return submitCallback
}

export function useThunkDispatch<TBody, TResponse>(thunk: AsyncThunk<TResponse, PortBodyThunkInput<TBody>, {}>):
    (t: TBody) => void{
        const dispatch = useAppDispatch()
        const { port: hubPort } = useContext(HubContext)

        const callback = useCallback(function(data: TBody){
            if(!!hubPort){
                dispatch(thunk({port: hubPort, body: data}))
            }
        },
            [hubPort, dispatch, thunk]
        )

        return callback
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

export function useHubHandshake() : HubContextType{

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

    return {
        port: toHubPort,
        isHubLoadError
    }
}