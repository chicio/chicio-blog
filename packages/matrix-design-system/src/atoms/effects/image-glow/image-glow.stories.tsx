import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageGlow } from ".";
import { landscapeImage, squarePortrait } from "../../../stories/sample-media";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Effects/Image Glow",
    component: ImageGlow,
};

export default meta;

type Story = StoryObj;

const DefaultStory = () => (
    <div className="flex">
        <ImageGlow
            className="h-[150px] w-[150px] rounded-full"
            src={squarePortrait}
            alt="Fabrizio Duroni"
            width={150}
            height={150}
        />
    </div>
);

const NoGlowStory = () => (
    <div className="flex">
        <ImageGlow src={squarePortrait} alt="Fabrizio Duroni" width={150} height={150} />
    </div>
);

const AuthorBylineStory = () => (
    <div className="flex items-center gap-2">
        <ImageGlow
            className="rounded-full"
            src={squarePortrait}
            alt="Antonino Gitto"
            width={30}
            height={30}
            noPlaceholder={true}
        />
        <p className="text-primary-text">Antonino Gitto</p>
    </div>
);

const FillCoverStory = () => (
    <div className="relative h-64 w-full overflow-hidden">
        <ImageGlow
            fill={true}
            className="relative! h-full! w-full! object-cover"
            src={landscapeImage}
            alt="Digital painting from the art gallery"
        />
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const NoGlow: Story = { render: () => <NoGlowStory /> };
export const AuthorByline: Story = { render: () => <AuthorBylineStory /> };
export const FillCover: Story = { render: () => <FillCoverStory /> };
