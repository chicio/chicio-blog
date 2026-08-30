import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelfHostedVideo } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Video/Self Hosted Video",
    component: SelfHostedVideo,
};

export default meta;

type Story = StoryObj;

const appJsConfTalk = "/media/content/blog/post/2026/06/01/app-js-conf-2026/app-js-conf-2026-william-1.mp4";
const kungFu = "/media/video/i-know-kung-fu.mp4";

const DefaultStory = () => (
    <div className="max-w-2xl">
        <SelfHostedVideo src={appJsConfTalk} />
    </div>
);

const WithCaptionStory = () => (
    <div className="max-w-2xl">
        <SelfHostedVideo src={appJsConfTalk} caption="William Candillon on stage at App.js Conf 2026" />
    </div>
);

const CustomSizingStory = () => (
    <div className="max-w-md">
        <SelfHostedVideo
            src={kungFu}
            ariaLabel="I know kung fu"
            className="border-accent-alpha-40 aspect-video w-full overflow-hidden rounded-xl border border-solid shadow-lg"
        />
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const WithCaption: Story = { render: () => <WithCaptionStory /> };
export const CustomSizing: Story = { render: () => <CustomSizingStory /> };
