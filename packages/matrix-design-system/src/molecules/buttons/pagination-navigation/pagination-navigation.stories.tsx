import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationNavigation } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Buttons/Pagination Navigation",
    component: PaginationNavigation,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => (
    <PaginationNavigation
        previousPageUrl="/blog/posts/2"
        nextPageUrl="/blog/posts/4"
        onPreviousClick={() => {}}
        onNextClick={() => {}}
    />
);

const FirstPageStory = () => (
    <PaginationNavigation previousPageUrl={undefined} nextPageUrl="/blog/posts/2" onNextClick={() => {}} />
);

const LastPageStory = () => (
    <PaginationNavigation previousPageUrl="/blog/posts/11" nextPageUrl={undefined} onPreviousClick={() => {}} />
);

export const Default: Story = { render: () => <DefaultStory /> };
export const FirstPage: Story = { render: () => <FirstPageStory /> };
export const LastPage: Story = { render: () => <LastPageStory /> };
