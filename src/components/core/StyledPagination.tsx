import { HStack, useColorModeValue } from "@chakra-ui/react"
import styled from "@emotion/styled"
import ReactPaginate, { ReactPaginateProps } from "react-paginate"

type StyledPaginationWrapperProps = {
    size: "small" | "medium" | "large",
    textColor: string,
    buttonColor: string,
    selectedButtonColor: string
}

const StyledPaginationWrapper = styled(HStack)<StyledPaginationWrapperProps>`
  ul {
    display: flex;
    w:100%;
    list-style: none;
    flex-wrap: wrap;

    li {

      a {
        display: flex;
        justify-content: center;
        text-align: center;
        padding: ${props => props.size === "small" ? "7px 9px" : props.size === "medium" ? "10px 12px" : "12px 15px"};
        font-size: ${props => props.size};
        font-weight: 600;
        line-height: 100%;
        outline: none;
        margin: ${props => props.size === "small" ? "0 5px 5px 0" : props.size === "medium" ? "0 8px 8px 0" : "0 13px 13px 0"};;
        cursor: pointer;
      }

      &:not(.break) a {
        color: ${props => props.textColor};
        background-color: ${props => props.buttonColor};
        border-radius: ${props => props.size === "small" ? "3px" : props.size === "medium" ? "5px" : "8px"};
        &:hover {
          background-color: #00B5D8;
        }
      }

      &.selected a {
        outline: solid;
        outline-color: #63b3ed;
        background-color: ${props => props.selectedButtonColor};
      }

      &.disabled a,
      &.disabled a:hover {
        cursor: default;
        background-color: #3d3d3d;
        color: #818181;
      }
    }
  }
`

export type StyledPaginationProps = {
    size: "small" | "medium" | "large"
    pageCount: number,
    selectedPage: number,
    handlePageClick: (event: { selected: number }) => void
} & ReactPaginateProps

export const StyledPagination: React.FC<StyledPaginationProps> = (props) => {

    const {size, pageCount, selectedPage, handlePageClick, ...rest} = props
    const textColor = useColorModeValue('#000000', '#ffffff')
    const buttonColor = useColorModeValue('#CBD5E0', '#4A5568')
    const selectedButtonColor = useColorModeValue('#EDF2F7', '#171923')

    return <StyledPaginationWrapper {...{size, textColor, buttonColor, selectedButtonColor}}>
        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={pageCount}
            previousLabel="< previous"
            forcePage={selectedPage}
            {...rest}
        />
    </StyledPaginationWrapper>
}

