import { IconButton, Tooltip, TooltipProps } from "@chakra-ui/react"
import { useState } from "react"
import { AiFillQuestionCircle } from "react-icons/ai"

export type InfoButtonProps = {
    infoMessage: string
} & Omit<TooltipProps, "onClick" | "children">

export const InfoButton: React.FC<InfoButtonProps> = ({infoMessage, ...rest}) => {
    
    const [isOpen, setIsOpen] = useState<boolean>(false)
    
    return <Tooltip label={infoMessage} {...{isOpen, ...rest}}>
            <IconButton icon={<AiFillQuestionCircle/>} aria-label={infoMessage}
                onClick={() => setIsOpen(v => !v)} bg="inherit"/>
        </Tooltip>
}