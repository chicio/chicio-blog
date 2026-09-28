import type { Meta, StoryObj } from "@storybook/react-vite";
import { PreviousNextNavigation } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Previous Next Navigation",
    component: PreviousNextNavigation,
};

export default meta;

type Story = StoryObj;

const BothSiblingsStory = () => (
    <PreviousNextNavigation
        previous={{ url: "/manga/death-note", title: "Death Note" }}
        next={{ url: "/manga/one-piece", title: "One Piece" }}
    />
);

// The first item of a collection has nothing before it, so only the red pill shows.
const FirstItemStory = () => <PreviousNextNavigation next={{ url: "/manga/one-piece", title: "One Piece" }} />;

// The last item has nothing after it, so only the blue pill shows.
const LastItemStory = () => <PreviousNextNavigation previous={{ url: "/manga/death-note", title: "Death Note" }} />;

export const BothSiblings: Story = { render: () => <BothSiblingsStory /> };
export const FirstItem: Story = { render: () => <FirstItemStory /> };
export const LastItem: Story = { render: () => <LastItemStory /> };
