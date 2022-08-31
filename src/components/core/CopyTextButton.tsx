import { FaCopy } from "react-icons/fa"
import { useClipboard, TooltipProps, Tooltip, IconButton } from "@chakra-ui/react"

export type CopyTextButtonProps = {
    text: string,
    copiedMsg: string,
    copyMsg: string
} & Omit<TooltipProps, "onClick" | "children">

export const CopyTextButton: React.FC<CopyTextButtonProps> = ({text, copiedMsg, copyMsg, ...rest}) => {
    
    const { hasCopied, onCopy } = useClipboard(text)
    const tooltip = hasCopied ? copiedMsg : copyMsg

    {/*Non-MVP: Make tooltip disappear a fraction of a second after it's copied*/}
    return <Tooltip label={tooltip} closeOnClick={false} {...rest}>
        <IconButton aria-label={tooltip}
            icon={<FaCopy/>} onClick={onCopy} bg="inherit"/>
    </Tooltip>

}
