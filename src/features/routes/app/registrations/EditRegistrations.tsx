import { ButtonGroup, Grid, GridItem, Heading, HStack,
    Icon, IconButton, Input, InputProps, VStack, useColorModeValue, Tooltip, Link, FormControl } from "@chakra-ui/react"
import { FaPlusCircle } from "react-icons/fa"
import { MdEditNote, MdUpdate } from "react-icons/md"
import { ImBin } from "react-icons/im"
import { BiMoveVertical } from "react-icons/bi"
import { useDrag, useDrop } from "react-dnd"
import { useCallback, useState } from "react"
import AlphaSortButtons from "../../../../components/core/AlphaSortButtons"
import { BsFillArrowUpRightSquareFill } from "react-icons/bs"
import { AggregatedRegistrationUpdateStatusIcon, RegistrationUpdateStatusIcon } from "./RegistrationUpdateStatusIcon"
import { Registration, RegistrationsValidationResult, RegistrationValidationResult, validateRegistrations } from "../../../../packages/YipStackLib/types/registrations"
import { hasErrors, ValidationResult } from "../../../../packages/YipStackLib/packages/YipAddress/validate/validation"
import { FormValidationErrorMessage } from "../../../../components/core/FormValidationErrorMessage"
import { PageWithHeading } from "../../../../components/hoc/PageWithHeading"
import { standardValidationControlDataFromArray, ValidationComponentProps, ValidationControl } from "../../../../components/hoc/ValidationControl"
import { useValidation, useMutableIndexed, usePagination, useEnhancedValidation } from "../../../../app/hooks"
import { StyledPagination } from "../../../../components/core/StyledPagination"
import { newSimpleDate, simpleDateToDate } from "../../../../packages/YipStackLib/packages/YipAddress/util/date"
import { ConfirmationPopoverButton } from "../../../../components/core/ConfirmationPopoverButton"
import { FetchUserAddressDataThunk, UserAddressSliceData } from "../../../useraddressdata/userAddressDataSlice"
import { EditRegistrationsData, EditRegistrationsSubmissionThunk } from "./submit/editRegistrationsSubmissionSlice"
import { useYipCodeToUserAddressMap } from "../../../useraddressdata/userAddressDataHooks"
import { LogoLoadStateWrapper } from "../../../../components/hoc/LoadStateWrapper"
import { useClearEditRegistrationsSubmission, useEditRegistrationsHubSubmit, useEditRegistrationsSubmissionState, useEditRegistrationsSubmitRetry } from "./submit/editRegistrationsSubmissionHooks"
import { ValidateSubmitButton } from "../../../../components/core/ValidateSubmitButton"
import { SubmissionStatus } from "../../../../util/redux/slices/submissionSlice"
import { EditRegistrationsSubmitted } from "./submit/EditRegistrationsSubmitted"
import { EditRegistrationsSuccess } from "./submit/EditRegistrationsSuccess"
import { EditRegistrationsFailed } from "./submit/EditRegistrationsFailed"

export type ConnectedEditRegistrationsProps = {
    yipCode: string,
    fetchThunk: FetchUserAddressDataThunk,
    submissionThunk: EditRegistrationsSubmissionThunk
}

export function ConnectedEditRegistrations(props: ConnectedEditRegistrationsProps){
    const { yipCode, fetchThunk, submissionThunk } = props

    const [addressesMap, addressesLoadStatus] = useYipCodeToUserAddressMap(fetchThunk)

    const address = addressesMap.get(yipCode)

    const submitThunkAction = useEditRegistrationsHubSubmit(submissionThunk)

    const submitRegistrations : (rs: Registration[]) => void
     = useCallback(function(rs: Registration[]){
        const thunkInput: EditRegistrationsData = {
            registrations: rs,
            yipCode
        }
        submitThunkAction(thunkInput)
    }, [submissionThunk, yipCode, submitThunkAction])

    const { status: submissionStatus, submitted } = useEditRegistrationsSubmissionState()
    const submittedYipCode = submitted?.yipCode || null
    const clearSubmissionState = useClearEditRegistrationsSubmission()
    const retrySubmission = useEditRegistrationsSubmitRetry(submissionThunk)

    const loadedElement = address !== undefined ? <EditRegistrationsLoaded 
        {...{address, submitRegistrations}}/> : <>ERROR: Address not found</>

    if(submissionStatus === SubmissionStatus.Clear){
        return <LogoLoadStateWrapper status = {addressesLoadStatus} loadedElement={loadedElement}
        h="100%" flexGrow={1} justify="center" logoSize={80}/>
    } else if(submissionStatus === SubmissionStatus.Submitted){
        return <EditRegistrationsSubmitted {...{yipCode: submittedYipCode}}/>
    } else if(submissionStatus === SubmissionStatus.Responded){
        return <EditRegistrationsSuccess {...{yipCode: submittedYipCode, clearSubmissionState}}/>
    } else {
        return <EditRegistrationsFailed {...{yipCode: submittedYipCode, clearSubmissionState, retrySubmission}}/>
    }

}

type EditRegistrationsLoadedProps = {
    address: UserAddressSliceData,
    submitRegistrations : (rs: Registration[]) => void
}

function EditRegistrationsLoaded(props: EditRegistrationsLoadedProps){
    
    const { address, submitRegistrations } = props
    const baseRegistrations = address.addressData.registrations
    const addressItem = address.addressData.address
    const effectiveAddressName = addressItem.name ?? addressItem.yipCode
    const addressLastUpdated = simpleDateToDate(addressItem.addressMetadata.lastUpdated)

    // TODO: Include a version number for optimistic locking
    const [registrations, setRegistrations] = useState(baseRegistrations)

    const getRegistrations = useCallback(() => registrations, [registrations])

    const reset = useCallback(function(){
        setRegistrations(baseRegistrations)
    }, [address])

    const saveRegistrations = useCallback(function(){
        submitRegistrations(registrations)
    }, [submitRegistrations, registrations])

    const { validation, updateValidation: revalidate } = useValidation(getRegistrations,
        validateRegistrations, r => r.topValidationResult, [registrations])
    
    return <EditRegistrations {...{registrations, validation, saveRegistrations, reset,
        setRegistrations, addressName: effectiveAddressName, addressLastUpdated, revalidate}}/>
}

export type EditRegistrationsProps = {
    registrations: Registration[],
    validation: RegistrationsValidationResult | null,
    revalidate: () => ValidationResult,
    saveRegistrations: () => void,
    reset: () => void,
    setRegistrations: (newRegistrations: Registration[]) => void,
    addressName: string,
    addressLastUpdated: Date,
}

export const EditRegistrations: React.FC<EditRegistrationsProps> = (props) => {
    
    const {registrations, addressName, setRegistrations, addressLastUpdated, validation,
        saveRegistrations, reset, revalidate } = props
    const [indexedRegistrations, _] = useMutableIndexed(registrations)
    const itemsPerPage = 10

    const {currentItems, pageCount, selectedPage, handlePageClick, itemOffset} = 
        usePagination(itemsPerPage, indexedRegistrations, false)

    function addNewRegistration(){
        const addressLastUpdated = newSimpleDate()
        registrations.splice(itemOffset, 0, {name: "", addressLastUpdated})
        setRegistrations([...registrations])
    }

    const addNewRegistrationCallback = useCallback(addNewRegistration, [registrations, itemOffset])

    function getRegsitrationValidation(i: number) : RegistrationValidationResult | null{
        if(validation === null){
            return null
        }
        const result = validation.itemValidations[i]
        if(result === undefined){
            throw new Error(`Index out of bounds: ${i}`)           
        }
        return result
    }

    function renderButtonGroup({isInvalid}: ValidationComponentProps){
        return <EditRegistrationsButtonGroup {...{isInvalid, saveRegistrations,
            addNewRegistration: addNewRegistrationCallback, reset, validation, revalidate}} />
    }

    const { validationErrorMessage, isInvalid } = standardValidationControlDataFromArray(validation)

    //TODO: Devise better solution for mobile screen e.g. a vertical list of items & a drawer on each
    return <PageWithHeading heading={`Edit Registrations (${addressName})  `} icon={MdEditNote}>
        <VStack w="100%" p = {{ base: 2, sm: 4, md: 8 }}>
            <HStack w="100%" justifyContent="flex-start">
            <ValidationControl isInvalid={isInvalid} render={renderButtonGroup}
                validationErrorMessage={validationErrorMessage}/>
            </HStack>
            <Grid width="100%" gap={{ base: 1, sm: 2, md: 3 }} templateColumns='repeat(1, min-content) repeat(2, auto) max-content'
                bg={useColorModeValue('gray.50', 'whiteAlpha.100')} p={{ base: 1, sm: 3, md: 5 }}
                borderRadius="lg">
                <TitleRow {...{registrations, addressLastUpdated, setRegistrations}}/>
                {currentItems.map(({obj: _, index}) => <EditRegistrationRow
                    {...{addressLastUpdated, registrations}}
                    index={index} key={index} setRegistrations={setRegistrations}
                    validation={getRegsitrationValidation(index)} />)}
            </Grid>
            <StyledPagination size="small"
                {...{
                    handlePageClick,
                    selectedPage,
                    pageCount
                }}                    
            />
        </VStack>
    </PageWithHeading>        
}

type EditRegistrationsButtonGroupProps = {
    saveRegistrations: () => void,
    addNewRegistration: () => void,
    reset: () => void,
    isInvalid: boolean,
    revalidate: () => ValidationResult,
    validation: RegistrationsValidationResult | null
}

function EditRegistrationsButtonGroup(props: EditRegistrationsButtonGroupProps){
    const buttonGroupBg = useColorModeValue('gray.50', 'gray.900')
    const addNewRegistrationTooltip = "Add new registration"
    const resetPopoverBodyMessage = "Are you sure you want to reset edits made to the registrations?"
    const confirmButtonBg = useColorModeValue('gray.50', 'gray.900')
    const saveLabel = "Save changes"

    const { saveRegistrations, addNewRegistration, reset, revalidate, validation } = props

    return <ButtonGroup isAttached variant='outline'
        bg={buttonGroupBg} borderRadius="lg">
        <ValidateSubmitButton {...{tooltipLabel: saveLabel, text: "Save",
            validation: validation?.topValidationResult ?? null, submitChanges: saveRegistrations, revalidate}}/>
        <ConfirmationPopoverButton {...{popoverBodyMessage: resetPopoverBodyMessage,
            confirmButtonBg, action: reset, actionName: "Reset"}}/>
        <Tooltip label={addNewRegistrationTooltip} placement="top" openDelay={500}>
            <IconButton aria-label={addNewRegistrationTooltip}
                icon={<Icon as={FaPlusCircle}/>} onClick={addNewRegistration}/>
        </Tooltip>
    </ButtonGroup>
}

type TitleRowProps = {
    registrations: Registration[],
    addressLastUpdated: Date,
    setRegistrations: (newRegistrations: Registration[]) => void
}


const TitleRow: React.FC<TitleRowProps> = ({registrations, addressLastUpdated, setRegistrations}) => {

    const markAllUpToDateLabel = "Mark all registrations up to date."

    function markAllAsUpToDate(){
        const newRegistrations = registrations.map(r => updateDate(r))
        setRegistrations(newRegistrations)
    }

    return <div style={{display: "contents"}}>
        <GridItem/>
        <GridItem>
            <HStack h="100%">
                <TitleHeading heading="Name"/>
                <AlphaSortButtons arr={registrations} setter={setRegistrations}
                    sortField={r => r.name} sortFieldDesc="name"/>
            </HStack>
        </GridItem>
        <GridItem>
            <HStack h="100%">
                <TitleHeading heading="Link"/>
                <AlphaSortButtons arr={registrations} setter={setRegistrations}
                    sortField={r => r.hyperlink ?? ""} sortFieldDesc="hyperlink"/>
            </HStack>
        </GridItem>
        <GridItem>
        <HStack justify="center" h="100%" paddingRight={2}>
                <TitleHeading heading="Last Updated"/>
                <HStack flexGrow={1}/>
                <Tooltip label={markAllUpToDateLabel} placement="top" openDelay={1500}>
                    <IconButton aria-label={markAllUpToDateLabel} bg="inherit"
                        icon={<Icon as={MdUpdate}/>} onClick={markAllAsUpToDate}/>
                </Tooltip>
                <AggregatedRegistrationUpdateStatusIcon {...{registrations, addressLastUpdated}}/>
            </HStack>
        </GridItem>
    </div>
}

type TitleHeadingProps = {
    heading: string
}

const TitleHeading: React.FC<TitleHeadingProps> = ({heading}) => {
    return <Heading
        fontWeight={600}
        fontSize={{ base: 's', sm: 'm', md: 'l' }}
        lineHeight={'110%'}>
    {heading}
    </Heading>
}

type EditRegistrationRowProps = {
    registrations: Registration[],
    index: number,
    setRegistrations: (newRegistrations: Registration[]) => void,
    addressLastUpdated: Date,
    validation: RegistrationValidationResult | null
}

const ItemTypes = {
    row: 'row'
}

function updateDate(r: Registration){
    r.addressLastUpdated = newSimpleDate()
    return r
}

const EditRegistrationRow: React.FC<EditRegistrationRowProps> = ({registrations, setRegistrations, index, addressLastUpdated, validation}) => {
    
    const registration = registrations[index]

    const handleRegistrationChange = (change: (r : Registration) => Registration) => 
    {
        const registrationToChange = registrations[index]
        if(!!registrationToChange){
            const updatedRegistration = change(registrationToChange)
            const newRegistrations = [...registrations]
            newRegistrations[index] = updatedRegistration
            setRegistrations(newRegistrations)
        }
        else{
            throw new Error("Problem getting registration at index");            
        }
    }

    function updateRegistrationDate(){
        handleRegistrationChange(updateDate)
    }

    const handleMove = useCallback(function (from: number, to: number){
        const moveElement = registrations.splice(from, 1)[0]        
        if(moveElement !== undefined){
            registrations.splice(to, 0, moveElement)
            setRegistrations([...registrations])
        }
        else{
            throw new Error("Problem getting registration at index");            
        }
    }, [registrations])    

    if(!registration){
        throw new Error(`Problem getting registration from registrations list at index ${index}`);
    }

    const name = registration.name
    const hyperlink = registration.hyperlink
    const deleteButtonLabel = "Delete this registration"
    const updateButtonlLabel = "Mark registration as up to date"

    const handleInputRegistrationChange =
        (updater: (r: Registration, s: string) => Registration) =>
        (e : React.ChangeEvent<HTMLInputElement>) => {
            handleRegistrationChange(r => updater(r, e.target.value))
    }

    function removeRegistration(){
        setRegistrations(registrations.filter((_, i) => i != index))
    }
    
    const [{isDragging}, drag] = useDrag({
        type: ItemTypes.row,
        collect: monitor => ({
          isDragging: !!monitor.isDragging()
        }),
        item: {dragIndex: index}
      })
  
      const [{ isOver }, drop] = useDrop(() => ({
          accept: ItemTypes.row,
          drop: ({dragIndex}: DragItem) => handleMove(dragIndex, index),
          collect: monitor => ({
            isOver: !!monitor.isOver(),
          }),
    }), [handleMove])

    const standardInputBg = useColorModeValue('gray.100', 'gray.900')
    const inputBg = isOver! ? 'cyan.400' : standardInputBg

    const nameValidationResult = validation?.fieldValidations?.name ?? null

    return <div style={{display: "contents", opacity: isDragging ? 0.5 : 1}} ref={drop}>
        <GridItem bg={isOver! ? 'cyan.400' : 'inherit'} borderRadius="lg" opacity="inherit">
            <ButtonGroup variant="ghost" isAttached>
                <IconButton aria-label={"Move registration up or down"}
                    icon={<Icon as={BiMoveVertical}/>} ref={drag} cursor="grab"/>
                <Tooltip label={deleteButtonLabel} placement="top" openDelay={1500}>
                    <IconButton aria-label={deleteButtonLabel}
                        icon={<Icon as={ImBin}/>} onClick={removeRegistration}/>
                </Tooltip>
            </ButtonGroup>
        </GridItem>
        <NameCell {...{name, handleInputRegistrationChange, nameValidationResult}} bg={inputBg}/>
        <HyperLinkCell {...{hyperlink: hyperlink ?? "", handleInputRegistrationChange}} bg={inputBg}/>
        <GridItem bg="inherit">
            <HStack bg={inputBg} borderRadius="lg" justify="center" paddingRight={2} paddingLeft={2}>
                <label>{simpleDateToDate(registration.addressLastUpdated).toDateString()}</label>
                <HStack flexGrow={1}/>
                <Tooltip label={updateButtonlLabel} placement="top" openDelay={1500}>
                    <IconButton aria-label={updateButtonlLabel} bg="inherit"
                        icon={<Icon as={MdUpdate}/>} onClick={updateRegistrationDate}/>
                </Tooltip>
                <RegistrationUpdateStatusIcon {...{addressLastUpdated, registration}}/>
            </HStack>
        </GridItem>
    </div>
}

type GridCellProps = {
    handleInputRegistrationChange: (updater: (r: Registration, s: string) => Registration)
        => (e: React.ChangeEvent<HTMLInputElement>) => void
}

type NameCellProps = {
    name: string,
    bg: string,
    nameValidationResult: ValidationResult | null
} & GridCellProps

type DragItem = {
    dragIndex: number
}

const NameCell: React.FC<NameCellProps> = ({name,
handleInputRegistrationChange, bg, nameValidationResult}) => {

    const enhanced = useEnhancedValidation(nameValidationResult)

    const anyErrors = hasErrors(nameValidationResult)
    const props: InputProps = {
        value: name,
        onChange: handleInputRegistrationChange((r, s) => {return {...r, name: s}})
    }
    if(!name){
        props.placeholder="Add name"
    }
    return <GridItem bg="inherit">
        <FormControl isInvalid={anyErrors} isRequired>
            <Input {...props} bg={bg} borderRadius="lg" opacity="inherit"/>
            <FormValidationErrorMessage validation={enhanced}/>
        </FormControl>
    </GridItem>
}


type HyperLinkCellProps = {
    hyperlink: string,
    bg: string
} & GridCellProps

const HyperLinkCell: React.FC<HyperLinkCellProps> = ({hyperlink, handleInputRegistrationChange, bg}) => {
    const props: InputProps = {
        value: hyperlink,
        onChange: handleInputRegistrationChange((r, s) => {return {...r, hyperlink: s}})
    }
    if(!hyperlink){
        props.placeholder="Add optional hyperlink"
    }
    return <GridItem bg="inherit">
        <HStack>
            <Input {...props} bg={bg} borderRadius="lg" opacity="inherit"/>
            {hyperlink!!?  <Link href={hyperlink} target="_blank">
                    <Icon as={BsFillArrowUpRightSquareFill}/>
                </Link>
                : <></>
            }
        </HStack>
    </GridItem>
}