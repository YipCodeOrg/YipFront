import { StackProps } from "@chakra-ui/react"
import LoadingLogo from "../core/LoadingLogo"

type AbstractSpinnerWrapperProps = {
    isSpinning: boolean,
    mainElement: JSX.Element,
}

export type SpinnerWrapperProps = {
    spinnerElement: JSX.Element,        
} & AbstractSpinnerWrapperProps

export function SpinnerWrapper(props: SpinnerWrapperProps){
    
    const { spinnerElement, mainElement, isSpinning } = props
     
    if(isSpinning){
        return spinnerElement
    } else {
        return mainElement
    }
}

export type LogoSpinnerWrapperProps = {
    logoSize: number
} & AbstractSpinnerWrapperProps & StackProps

export function LogoSpinnerWrapper({...rest}: LogoSpinnerWrapperProps){
    const spinner = <LoadingLogo lightCol='#000000' darkCol='#ffffff' {...rest}/>
    return <SpinnerWrapper {...rest} spinnerElement={spinner}/>
}