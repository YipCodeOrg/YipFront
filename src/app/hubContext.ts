import { createContext } from "react"

export type HubContextType = {
    port: MessagePort | null,
    isHubLoadError: boolean
}

export const HubContext = createContext<HubContextType>({port: null, isHubLoadError: false})