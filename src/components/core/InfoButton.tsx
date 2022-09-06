import { IconButton, Tooltip, TooltipProps } from "@chakra-ui/react"
import { useState } from "react"
import { AiFillQuestionCircle } from "react-icons/ai"

export type InfoButtonProps = {
    infoMessage: string,
    iconColor?: string
} & Omit<TooltipProps, "onClick" | "children">

export const InfoButton: React.FC<InfoButtonProps> = ({infoMessage, iconColor: iconBg, ...rest}) => {
    
    const [isOpen, setIsOpen] = useState<boolean>(false)
    
    return <Tooltip label={infoMessage} {...{isOpen, ...rest}}>
            <IconButton icon={<AiFillQuestionCircle/>} aria-label={infoMessage}
                color={iconBg ?? "inherit"} onClick={() => setIsOpen(v => !v)} variant="ghost" onBlur={() => {setIsOpen(false)}}/>
        </Tooltip>
}