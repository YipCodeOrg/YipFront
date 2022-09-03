import { ComponentMeta, ComponentStory } from "@storybook/react";
import { StyledPagination, StyledPaginationProps } from "./StyledPagination";

type StyledPaginationType = typeof StyledPagination

export default {
    component: StyledPagination,
    title: 'components/StyledPagination',
} as ComponentMeta<StyledPaginationType>

const Template: ComponentStory<StyledPaginationType> = (args: StyledPaginationProps) => <StyledPagination {...args}/>

export const Small = Template.bind({})
Small.args = {
    size: "small",
    handlePageClick: () => {},
    selectedPage: 2,
    pageCount: 5
}

export const Medium = Template.bind({})
Medium.args = {
    size: "medium",
    handlePageClick: () => {},
    selectedPage: 2,
    pageCount: 5
}

export const Large = Template.bind({})
Large.args = {
    size: "large",
    handlePageClick: () => {},
    selectedPage: 2,
    pageCount: 5
}