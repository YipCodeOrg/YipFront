import { Box, HStack, Icon, Input, StackProps, Tooltip } from "@chakra-ui/react"
import { FaFilter } from "react-icons/fa"
import { FilterResult } from "../../app/hooks"

type TextFilterProps<T> = {
    objPluralLabel: string,
    filterResult: FilterResult<T>,
    filterGenerator: (s: string) => (t: T) => boolean
} & StackProps

export function TextFilter<T>(props: TextFilterProps<T>){

    const { objPluralLabel, filterResult, filterGenerator, ...rest } = props
    const { applyFilter, clearFilter } = filterResult
    const tooltip = `Enter text to filter ${objPluralLabel}`

    function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>){
        const v = e.target.value
        if(v){
            applyFilter(filterGenerator(v))
        } else{
            clearFilter()
        }
    }

    return <HStack {...rest}>
        <Tooltip label={tooltip} placement="top" openDelay={1500}>
            <Box>
                <Icon as={FaFilter}/>
            </Box>
        </Tooltip>
        <Input onChange={handleFilterChange} maxW="500px"/>   
    </HStack>

}