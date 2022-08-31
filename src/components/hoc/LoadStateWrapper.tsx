import { Icon, StackProps, VStack, Text } from "@chakra-ui/react"
import { FunctionComponent } from "react"
import { BiError } from "react-icons/bi"
import { LoadStatus } from "../../app/types"
import LoadingLogo from "../core/LoadingLogo"

type AbstractLoadStateWrapperProps = {
    status: LoadStatus,
    loadedElement: JSX.Element
} & StackProps

type LoadStateWrapperProps = {
    loadingElement: JSX.Element,
    failedElement: JSX.Element
} & AbstractLoadStateWrapperProps

const LoadStateWrapper: FunctionComponent<LoadStateWrapperProps> =
    ({status, loadedElement, loadingElement, failedElement}) => {
    switch (status) {
        case LoadStatus.NotLoaded:
            return <></>
        case LoadStatus.Failed:
            return failedElement
        case LoadStatus.Pending:
            return loadingElement
        case LoadStatus.Loaded:
            return loadedElement
        default:
            throw new Error("Unexpected load state encountered");
    }
}

type LogoLoadStateWrapperProps = {
    logoSize: number
} & AbstractLoadStateWrapperProps

export const LogoLoadStateWrapper: FunctionComponent<LogoLoadStateWrapperProps> =
    ({status, loadedElement, ...rest}) => {
        const spinner = <LoadingLogo lightCol='#000000' darkCol='#ffffff' {...rest}/>
        return <LoadStateWrapper status={status}
            loadedElement={loadedElement}
            loadingElement={spinner}
            failedElement={<FailedElement {...rest}/>}
        />
}

type EmptyLoadStateWrapperProps = AbstractLoadStateWrapperProps 

export const EmptyLoadStateWrapper: FunctionComponent<EmptyLoadStateWrapperProps> =
    ({status, loadedElement, ...rest}) => {
        return <LoadStateWrapper status={status}
            loadedElement={loadedElement}
            loadingElement={<></>}
            failedElement={<FailedElement {...rest}/>}
        />
}

export const FailedElement: React.FC<StackProps> = (props) => {
    return <VStack {...props}>
        <Icon as={BiError}/>
        <Text>Component failed to load</Text>
    </VStack>
}

export default LoadStateWrapper