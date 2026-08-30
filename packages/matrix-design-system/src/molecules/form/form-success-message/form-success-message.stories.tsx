import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormSuccessMessage } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Form/Form Success Message",
    component: FormSuccessMessage,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => (
    <FormSuccessMessage message="Message sent! You should receive a confirmation email in your inbox shortly. I'll get back to you as soon as possible." />
);

const OfflineQueuedStory = () => (
    <FormSuccessMessage message="You're offline — your message has been saved and will be sent automatically when you reconnect to the internet." />
);

const ShortMessageStory = () => <FormSuccessMessage message="Message sent!" />;

export const Default: Story = { render: () => <DefaultStory /> };
export const OfflineQueued: Story = { render: () => <OfflineQueuedStory /> };
export const ShortMessage: Story = { render: () => <ShortMessageStory /> };
