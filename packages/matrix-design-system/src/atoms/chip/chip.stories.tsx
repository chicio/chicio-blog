import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Chip",
    component: Chip,
};

export default meta;

type Story = StoryObj;

// Single instances are wrapped in a flex row: in a plain block context the chip stretches to the
// full card width and reads as a bar rather than a chip.
const DefaultStory = () => (
    <div className="flex">
        <Chip>TypeScript</Chip>
    </div>
);

const BigStory = () => (
    <div className="flex">
        <Chip big>Data structures and algorithms</Chip>
    </div>
);

const TagRowStory = () => (
    <div className="flex flex-wrap gap-2">
        <Chip>Next.js</Chip>
        <Chip>React</Chip>
        <Chip>TailwindCSS</Chip>
        <Chip>Swift</Chip>
        <Chip>Kotlin</Chip>
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const Big: Story = { render: () => <BigStory /> };
export const TagRow: Story = { render: () => <TagRowStory /> };
