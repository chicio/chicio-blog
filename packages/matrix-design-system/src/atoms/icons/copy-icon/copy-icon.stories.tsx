import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../buttons/button";
import { CopiedIcon, CopyIcon } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Icons/Copy Icon",
    component: CopiedIcon,
};

export default meta;

type Story = StoryObj;

// CopiedIcon is a fixed size-4 checkmark — the confirmed state of the code-block copy button. On its
// own it is a 16px mark, so each cell gives it the label or button chrome it ships with.
const CopiedIconDefaultStory = () => (
    <div className="text-accent flex items-center gap-2">
        <CopiedIcon />
        <span className="font-mono text-sm">Copied!</span>
    </div>
);

const CopiedIconCopyButtonStory = () => (
    <div className="flex">
        <span className="border-accent bg-general-background-light text-accent flex items-center gap-2 rounded border px-3 py-2">
            <CopiedIcon />
            <span className="font-mono text-xs tracking-wider uppercase">Copied</span>
        </span>
    </div>
);

const CopiedIconCodeBlockHeaderStory = () => (
    <div className="border-accent bg-general-background-light flex w-full items-center justify-between rounded border px-3 py-2">
        <span className="text-primary-text font-mono text-xs">use-reading-progress.ts</span>
        <span className="text-accent flex items-center gap-2">
            <CopiedIcon />
            <span className="font-mono text-xs">Copied!</span>
        </span>
    </div>
);

// CopyIcon is a fixed 16px glyph that inherits its colour, so on its own it needs a coloured flex
// row to be legible; the other cells show it where it actually lives, inside a code-block button.
const CopyIconDefaultStory = () => (
    <div className="text-accent flex items-center gap-2 font-mono text-sm">
        <CopyIcon />
        <span>Copy code</span>
    </div>
);

const CopyIconInCopyButtonStory = () => (
    <div className="flex">
        <Button className="text-primary!" aria-label="Copy code">
            <CopyIcon />
        </Button>
    </div>
);

const CopyIconOnCodeBlockStory = () => (
    <div className="glow-container bg-general-background-light relative max-w-[500px] p-4">
        <Button className="text-primary! absolute top-2 right-2 p-2!" aria-label="Copy code">
            <CopyIcon />
        </Button>
        <div className="text-primary-text font-mono text-sm leading-relaxed">
            <div>const posts = await getAllPosts();</div>
            <div>return posts.slice(0, 5);</div>
        </div>
    </div>
);

export const CopiedIconDefault: Story = { render: () => <CopiedIconDefaultStory /> };
export const CopiedIconCopyButton: Story = { render: () => <CopiedIconCopyButtonStory /> };
export const CopiedIconCodeBlockHeader: Story = { render: () => <CopiedIconCodeBlockHeaderStory /> };
export const CopyIconDefault: Story = { render: () => <CopyIconDefaultStory /> };
export const CopyIconInCopyButton: Story = { render: () => <CopyIconInCopyButtonStory /> };
export const CopyIconOnCodeBlock: Story = { render: () => <CopyIconOnCodeBlockStory /> };
