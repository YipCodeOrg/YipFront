import { FunctionComponent } from "react"
import { LoadStatus } from "../../app/types"
import LoadingLogo from "../core/LoadingLogo"

type LoadStateWrapperProps = {
    status: LoadStatus,
    element: JSX.Element
}

const LoadStateWrapper: FunctionComponent<LoadStateWrapperProps> =
    ({status, element}) => {
    switch (status) {
        case LoadStatus.NotLoaded:
            return <></>
        case LoadStatus.Failed:
            return <>ERROR: Failed to get component's load status.</>
        case LoadStatus.Pending:
            return <LoadingLogo lightCol='#000000' darkCol='#ffffff' logoSize={80} spinnerSize="md"/>
        case LoadStatus.Loaded:
            return element
        default:
            throw new Error("Unexpected load state encountered");
    }
}

export default LoadStateWrapper