import { StackProps } from "@chakra-ui/react"
import { FunctionComponent } from "react"
import { LoadStatus } from "../../app/types"
import LoadingLogo from "../core/LoadingLogo"

type AbstractLoadStateWrapperProps = {
    status: LoadStatus,
    loadedElement: JSX.Element
}

type LoadStateWrapperProps = {
    loadingElement: JSX.Element
} & AbstractLoadStateWrapperProps

const LoadStateWrapper: FunctionComponent<LoadStateWrapperProps> =
    ({status, loadedElement, loadingElement}) => {
    switch (status) {
        case LoadStatus.NotLoaded:
            return <></>
        case LoadStatus.Failed:
            return <>ERROR: Component failed to load.</>
        case LoadStatus.Pending:
            return loadingElement
        case LoadStatus.Loaded:
            return loadedElement
        default:
            throw new Error("Unexpected load state encountered");
    }
}

interface LogoLoadStateWrapperProps extends StackProps, AbstractLoadStateWrapperProps  {
    logoSize: number
}

export const LogoLoadStateWrapper: FunctionComponent<LogoLoadStateWrapperProps> =
    ({status, loadedElement, ...rest}) => {
        const spinner = <LoadingLogo lightCol='#000000' darkCol='#ffffff' {...rest}/>
        return <LoadStateWrapper status={status}
            loadedElement={loadedElement}
            loadingElement={spinner}
        />
}

type EmptyLoadStateWrapperProps = AbstractLoadStateWrapperProps & StackProps

export const EmptyLoadStateWrapper: FunctionComponent<EmptyLoadStateWrapperProps> =
    ({status, loadedElement}) => {
        return <LoadStateWrapper status={status}
            loadedElement={loadedElement}
            loadingElement={<></>}
        />
}

export default LoadStateWrapper