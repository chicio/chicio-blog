import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageTitle } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Typography/Page Title",
    component: PageTitle,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => <PageTitle>Data structures and algorithms</PageTitle>;

const ShortTitleStory = () => <PageTitle>Blog</PageTitle>;

const LongTitleStory = () => (
    <PageTitle>Use SwiftUI Path and Shape to render your svg files: a practical example</PageTitle>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const ShortTitle: Story = { render: () => <ShortTitleStory /> };
export const LongTitle: Story = { render: () => <LongTitleStory /> };
