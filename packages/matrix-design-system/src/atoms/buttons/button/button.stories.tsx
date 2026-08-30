import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Buttons/Button",
    component: Button,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => (
    <div className="flex">
        <Button onClick={() => {}}>Read the full article</Button>
    </div>
);

const WithIconStory = () => (
    <div className="flex">
        <Button className="my-2 flex items-center gap-4" onClick={() => {}} type="button">
            <div className="flex-shrink-0">💬</div>
            <span className="text-primary-text flex-1 text-sm leading-normal">
                What did you work on at lastminute.com?
            </span>
        </Button>
    </div>
);

const ActionRowStory = () => (
    <div className="flex flex-wrap gap-3">
        <Button onClick={() => {}}>
            <p>TL;DR</p>
        </Button>
        <Button onClick={() => {}}>
            <p>Key Points</p>
        </Button>
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const WithIcon: Story = { render: () => <WithIconStory /> };
export const ActionRow: Story = { render: () => <ActionRowStory /> };
