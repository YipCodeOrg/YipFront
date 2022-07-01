import { FunctionComponent } from "react"
import { LoadStatus } from "../../app/types"
import LoadingLogo from "../core/LoadingLogo"

type LoadStateWrapperProps = {
    status: LoadStatus,
    loadedElement: JSX.Element,
    loadingElement: JSX.Element
}

type LogoLoadStateWrapperProps = {
    status: LoadStatus,
    loadedElement: JSX.Element
}

const LoadStateWrapper: FunctionComponent<LoadStateWrapperProps> =
    ({status, loadedElement, loadingElement}) => {
    switch (status) {
        case LoadStatus.NotLoaded:
            return <></>
        case LoadStatus.Failed:
            return <>ERROR: Failed to get component's load status.</>
        case LoadStatus.Pending:
            return loadingElement
        case LoadStatus.Loaded:
            return loadedElement
        default:
            throw new Error("Unexpected load state encountered");
    }
}

export const LogoLoadStateWrapper: FunctionComponent<LogoLoadStateWrapperProps> =
    ({status, loadedElement}) => {
        const spinner = <LoadingLogo lightCol='#000000' darkCol='#ffffff' logoSize={80} spinnerSize="md"/>
        return <LoadStateWrapper status={status}
            loadedElement={loadedElement}
            loadingElement={spinner}
        />
}

export const EmptyLoadStateWrapper: FunctionComponent<LogoLoadStateWrapperProps> =
    ({status, loadedElement}) => {
        return <LoadStateWrapper status={status}
            loadedElement={loadedElement}
            loadingElement={<></>}
        />
}

export default LoadStateWrapper