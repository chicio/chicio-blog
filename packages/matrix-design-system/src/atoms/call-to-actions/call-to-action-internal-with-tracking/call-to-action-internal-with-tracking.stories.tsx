import type { Meta, StoryObj } from "@storybook/react-vite";
import { CallToActionInternalWithTracking } from ".";
import { BiEnvelope } from "react-icons/bi";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Call To Actions/Call To Action Internal With Tracking",
    component: CallToActionInternalWithTracking,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => (
    <div className="flex">
        <CallToActionInternalWithTracking to="/blog" onClick={() => {}}>
            Go to the blog
        </CallToActionInternalWithTracking>
    </div>
);

const IconOnlyStory = () => (
    <div className="flex">
        <CallToActionInternalWithTracking to="/contact" onClick={() => {}} className="min-w-auto!">
            <BiEnvelope size={30} />
        </CallToActionInternalWithTracking>
    </div>
);

const NavigationRowStory = () => (
    <div className="flex flex-wrap gap-4">
        <CallToActionInternalWithTracking to="/data-structures-and-algorithms/roadmap">
            DSA roadmap
        </CallToActionInternalWithTracking>
        <CallToActionInternalWithTracking to="/chat">Chat with my AI</CallToActionInternalWithTracking>
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const IconOnly: Story = { render: () => <IconOnlyStory /> };
export const NavigationRow: Story = { render: () => <NavigationRowStory /> };
