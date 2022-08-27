import { Box, Icon, Tooltip } from "@chakra-ui/react"
import { HiExclamationCircle } from "react-icons/hi"
import { IoIosCheckmarkCircle } from "react-icons/io"
import { isRegistrationUpToDate, Registration } from "../../../../packages/YipStackLib/types/registrations"

type RegistrationUpdateStatusIconProps = {
    registration: Registration,
    addressLastUpdated: Date
}

export const RegistrationUpdateStatusIcon: React.FC<RegistrationUpdateStatusIconProps> =
({registration, addressLastUpdated}) => {
const isUpToDate = isRegistrationUpToDate(registration, addressLastUpdated)
    if(isUpToDate){
        return <Tooltip label="The address registered at this organisation is up to date.">
                <Box h="16px">
                    <Icon as={IoIosCheckmarkCircle} color="green.500"/>
                </Box>
            </Tooltip>
    } else {
        return <Tooltip label="The address registered at this organisation is out of date. Consider updating it.">
            <Box h="16px">
                <Icon as={HiExclamationCircle} color="red.500"/>
            </Box>
        </Tooltip>
    }
}

type AggregatedRegistrationUpdateStatusIconprops = {
    registrations: Registration[],
    addressLastUpdated: Date
}

export const AggregatedRegistrationUpdateStatusIcon: React.FC<AggregatedRegistrationUpdateStatusIconprops> =
    ({registrations, addressLastUpdated}) => {
    const allUpToDate = registrations.every(r => isRegistrationUpToDate(r, addressLastUpdated))
    if(allUpToDate){
        return <Tooltip label="All registered addresses are up to date.">
                <Box h="16px">
                    <Icon as={IoIosCheckmarkCircle} color="green.500"/>
                </Box>
            </Tooltip>
    } else {
        return <Tooltip label="Some registered addresses are out of date. Consider updating them.">
            <Box h="16px">
                <Icon as={HiExclamationCircle} color="red.500"/>
            </Box>
        </Tooltip>
    }
}
