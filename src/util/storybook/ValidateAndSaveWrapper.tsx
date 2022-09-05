import { useState } from "react"

export type ValidateAndSaveProps<T, TVal> = {
    arr: T[],
    setArr: (newArr: T[]) => void,
    validation: TVal | null,
    save: () => void
}

export type ValidateAndSaveWrapperProps<T, TVal> = {
    initialArr: T[],
    validate: (ts: T[]) => TVal
    render: (props: ValidateAndSaveProps<T, TVal>) => JSX.Element
}

export function ValidateOnSaveAndUpdateWrapper<T, TVal>(props: ValidateAndSaveWrapperProps<T, TVal>){
    const { render, initialArr, validate } = props

    const [arr, setArr] = useState(initialArr)
    const [validation, setValidation] = useState<TVal | null>(null)

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

    const childProps: ValidateAndSaveProps<T, TVal> = {
        arr,
        setArr: setAndMaybeValidate,
        validation,
        save
    }

    return render(childProps)
}