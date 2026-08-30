import type { Meta, StoryObj } from "@storybook/react-vite";
import { BluePillLink, RedPillLink } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Links/Pills Links",
    component: BluePillLink,
};

export default meta;

type Story = StoryObj;

// The blue pill is always the "stay where you are" / previous direction in this design system:
// previous DSA topic, previous blog page, previous videogame.
const BluePillLinkDefaultStory = () => (
    <div className="flex">
        <BluePillLink to="/data-structures-and-algorithms/topic/binary-search">Binary Search</BluePillLink>
    </div>
);

const BluePillLinkPaginationStory = () => (
    <div className="flex">
        <BluePillLink to="/blog/page/2">Previous</BluePillLink>
    </div>
);

const BluePillLinkLongTopicTitleStory = () => (
    <div className="flex">
        <BluePillLink to="/data-structures-and-algorithms/topic/binary-search-tree">
            Binary Search Tree and Ordered Set
        </BluePillLink>
    </div>
);

// The red pill is always the "go deeper" / next direction: next DSA topic, next blog page, next
// videogame in the collection.
const RedPillLinkDefaultStory = () => (
    <div className="flex">
        <RedPillLink to="/data-structures-and-algorithms/topic/graph">Graph</RedPillLink>
    </div>
);

const RedPillLinkPaginationStory = () => (
    <div className="flex">
        <RedPillLink to="/blog/page/4">Next</RedPillLink>
    </div>
);

const RedPillLinkLongTopicTitleStory = () => (
    <div className="flex">
        <RedPillLink to="/data-structures-and-algorithms/topic/longest-increasing-subsequence-dp">
            Longest Increasing Subsequence DP
        </RedPillLink>
    </div>
);

export const BluePillLinkDefault: Story = { render: () => <BluePillLinkDefaultStory /> };
export const BluePillLinkPagination: Story = { render: () => <BluePillLinkPaginationStory /> };
export const BluePillLinkLongTopicTitle: Story = { render: () => <BluePillLinkLongTopicTitleStory /> };
export const RedPillLinkDefault: Story = { render: () => <RedPillLinkDefaultStory /> };
export const RedPillLinkPagination: Story = { render: () => <RedPillLinkPaginationStory /> };
export const RedPillLinkLongTopicTitle: Story = { render: () => <RedPillLinkLongTopicTitleStory /> };
