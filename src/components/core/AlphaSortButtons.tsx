import { ButtonGroup, Icon, IconButton, Tooltip } from "@chakra-ui/react"
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa"

export type FieldSortButtonsProps<T> = {
    arr: T[],
    setter: (newArr: T[]) => void,
    sortField: (r: T) => string
}

export default function AlphaSortButtons<T>(props: React.PropsWithChildren<FieldSortButtonsProps<T>>){
    
    const {arr, setter, sortField} = props

    const sortAtoZ = "Sort A to Z"
    const sortZtoA = "Sort Z to A"

    function compareForward(v1: T, v2: T) : number{
        const f1 = sortField(v1)
        const f2 = sortField(v2)
        return f1.localeCompare(f2)
    }

    function compareBackward(v1: T, v2: T) : number{
        return -compareForward(v1, v2)
    }

    function sortForward(){
        setter([...arr.sort(compareForward)])
    }

    function sortBackward(){
        setter([...arr.sort(compareBackward)])
    }

    return <ButtonGroup variant="ghost" isAttached>
        <Tooltip label={sortAtoZ} placement="top" openDelay={1500}>
            <IconButton aria-label={sortAtoZ}
                icon={<Icon as={FaSortAlphaDown}/>} onClick={sortForward}/>
        </Tooltip>
        <Tooltip label={sortZtoA} placement="top" openDelay={1500}>
            <IconButton aria-label={sortZtoA}
                icon={<Icon as={FaSortAlphaUp}/>} onClick={sortBackward}/>
        </Tooltip>
    </ButtonGroup>
}