import { Box, HStack, Icon, Input, StackProps, Tooltip } from "@chakra-ui/react"
import { FaFilter } from "react-icons/fa"
import { IndexFilterResult } from "../../app/hooks"

type TextFilterProps<T> = {
    objPluralLabel: string,
    filterResult: IndexFilterResult<T>,
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

export function lowercaseFilterInSomeProp<T>(filterValue: string, 
    filterProps: ((t: T) => string)[]): (t: T) => boolean{
        return (t) => {
            const filterPropVals = filterProps.map(fp => fp(t).toLocaleLowerCase())
            const filterValueLower = filterValue.toLocaleLowerCase()
            return filterPropVals.some(v => v.includes(filterValueLower))
        }
}