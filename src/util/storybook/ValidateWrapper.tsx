import { useState } from "react"
import { Indexed } from "../../packages/YipStackLib/packages/YipAddress/util/types"

export type ListUpdateValidateRenderProps<T, TValid> = {
    arr: T[],
    setArr: (newArr: T[]) => void,
    validation: TValid | null,
    save: () => void
}

export type ListUpdateValidateWrapperProps<T, TValid> = {
    initialArr: T[],
    validate: (ts: T[]) => TValid
    render: (props: ListUpdateValidateRenderProps<T, TValid>) => JSX.Element
}

export function ListUpdateValidateWrapper<T, TValid>(props: ListUpdateValidateWrapperProps<T, TValid>){
    const { render, initialArr, validate } = props

    const [arr, setArr] = useState(initialArr)
    const [validation, setValidation] = useState<TValid | null>(null)

    function setAndMaybeValidate(newArr: T[]){        
        setArr(newArr)
        if(validation != null){
            revalidate(newArr)
        }
    }

    function save(){
        revalidate(arr)
    }

    function revalidate(ts: T[]){
        const newValidation = validate(ts)
        setValidation(newValidation)        
    }

    const childProps: ListUpdateValidateRenderProps<T, TValid> = {
        arr,
        setArr: setAndMaybeValidate,
        validation,
        save
    }

    return render(childProps)
}

export type AppendValidateRenderProps<T, TValid> = {
    valsToAppend: T[],
    bufferNewVals: (bufferVals: T[]) => void,
    setValsToAppend: (newValsToAppend: T[]) => void,
    validation: Indexed<TValid> | null,
    save: () => void
}

export type AppendValidateWrapperProps<T, TValid> = {
    initialArr: T[],
    validate: (ts: T[]) => TValid
    render: (props: AppendValidateRenderProps<T, TValid>) => JSX.Element
}

export function AppendValidateWrapper<T, TValid>(props: AppendValidateWrapperProps<T, TValid>){
    const { render, initialArr, validate } = props
    const [valsToAppend, setValsToAppend] = useState<T[]>([])

    const [validation, setValidation] = useState<TValid | null>(null)

    function newFullArray(newValsToAppend: T[]){
        return [...initialArr, ...newValsToAppend]
    }

    function bufferAndMaybeValidate(bufferVals: T[]){
        const newValsToAppend = [...valsToAppend, ...bufferVals]
        setValsToAppendAndMaybeValidate(newValsToAppend)
    }

    function setValsToAppendAndMaybeValidate(newValsToAppend: T[]){
        setValsToAppend(newValsToAppend)
        if(validation !== null){
            revalidate(newFullArray(newValsToAppend))
        }
    }

    function save(){
        revalidate(newFullArray(valsToAppend))
    }

    function revalidate(ts: T[]){
        const newValidation = validate(ts)
        setValidation(newValidation)        
    }

    const childProps: AppendValidateRenderProps<T, TValid> = {
        valsToAppend,
        bufferNewVals: bufferAndMaybeValidate,
        setValsToAppend: setValsToAppendAndMaybeValidate,
        validation: validation === null ? null : {obj: validation, index: initialArr.length},
        save
    }

    return render(childProps)
}

export type AppendSingletonValidateRenderProps<T, TValid> = {
    valToAppend: T | null,
    setValToAppend: (newValToAppend: T) => void,
    validation: Indexed<TValid> | null,
    save: () => void,
    cancel: () => void
}

export type AppendSingletonValidateWrapperProps<T, TValid> = {
    initialArr: T[],
    initialValToAppend: T,
    validate: (ts: T[]) => TValid
    render: (props: AppendSingletonValidateRenderProps<T, TValid>) => JSX.Element
}

export function AppendSingletonValidateWrapper<T, TValid>(props: AppendSingletonValidateWrapperProps<T, TValid>){
    
    const { render, initialArr, validate, initialValToAppend } = props

    const [valToAppend, setValToAppend] = useState<T>(initialValToAppend)
    const [validation, setValidation] = useState<TValid | null>(null)
    
    function newFullArray(newValToAppend: T | null){
        if(newValToAppend === null){
            return initialArr
        }
        return [...initialArr, newValToAppend]
    }

    function setAndMaybeValidate(newValToAppend: T){
        setValToAppend(newValToAppend)
        if(validation != null){
            revalidate(newFullArray(newValToAppend))
        }
    }

    function save(){
        revalidate(newFullArray(valToAppend))
    }

    function revalidate(ts: T[]){
        const newValidation = validate(ts)
        setValidation(newValidation)        
    }

    const childProps: AppendSingletonValidateRenderProps<T, TValid> = {
        valToAppend,
        setValToAppend: setAndMaybeValidate,
        validation: validation === null ? null : {obj: validation, index: initialArr.length},
        save,
        cancel: () => {}
    }

    return render(childProps)

}