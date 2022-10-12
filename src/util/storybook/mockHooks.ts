import { useRef } from "react"

export function useMockYipcodeGenerator(seed: string){
    const suffix = useRef<number>(0)
    return function(){
        suffix.current++
        return `${seed}${suffix.current}` 
    }
}
