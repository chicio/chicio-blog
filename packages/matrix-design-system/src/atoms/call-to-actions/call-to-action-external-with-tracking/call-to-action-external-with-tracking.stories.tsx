import type { Meta, StoryObj } from "@storybook/react-vite";
import { CallToActionExternalWithTracking } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Call To Actions/Call To Action External With Tracking",
    component: CallToActionExternalWithTracking,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => (
    <div className="flex">
        <CallToActionExternalWithTracking
            href="https://github.com/chicio/chicio-blog"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {}}
        >
            Github
        </CallToActionExternalWithTracking>
    </div>
);

const LongLabelStory = () => (
    <div className="flex">
        <CallToActionExternalWithTracking
            href="https://www.npmjs.com/package/react-native-skia-skeleton"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {}}
        >
            Read the documentation
        </CallToActionExternalWithTracking>
    </div>
);

const ProjectActionsStory = () => (
    <div className="flex flex-wrap gap-4">
        <CallToActionExternalWithTracking
            href="https://github.com/chicio/react-native-skia-skeleton"
            target="_blank"
            rel="noopener noreferrer"
        >
            Github
        </CallToActionExternalWithTracking>
        <CallToActionExternalWithTracking
            href="https://www.npmjs.com/package/react-native-skia-skeleton"
            target="_blank"
            rel="noopener noreferrer"
        >
            NPM
        </CallToActionExternalWithTracking>
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const LongLabel: Story = { render: () => <LongLabelStory /> };
export const ProjectActions: Story = { render: () => <ProjectActionsStory /> };
