import type { Meta, StoryObj } from "@storybook/react-vite";
import { RoundedIcon } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Icons/Rounded Icon",
    component: RoundedIcon,
};

export default meta;

type Story = StoryObj;

// RoundedIcon is the accent-filled circle behind the site's floating actions (the chat launcher, the
// back-to-top control). Its children are inline SVG glyphs drawn in currentColor, exactly like the
// react-icons glyphs the real ChatIcon passes in.
const chatGlyph = (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
        <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 14H5.17L4 17.17V4h16v12z" />
        <circle cx="8" cy="10" r="1.4" />
        <circle cx="12" cy="10" r="1.4" />
        <circle cx="16" cy="10" r="1.4" />
    </svg>
);

const arrowUpGlyph = (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
        <path d="M12 4l-8 8h5v8h6v-8h5z" />
    </svg>
);

const terminalGlyph = (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
        <path d="M3 4h18v16H3V4zm2 2v12h14V6H5zm2 2.5L10.5 12 7 15.5 8.2 16.7 12.9 12 8.2 7.3 7 8.5zM13 15h5v1.6h-5V15z" />
    </svg>
);

const DefaultStory = () => (
    <div className="flex">
        <RoundedIcon className="text-text-above-primary">{chatGlyph}</RoundedIcon>
    </div>
);

// The real ChatIcon pulses and is used as the icon of the chat page's "Ask the Oracle" heading, so
// this cell reproduces that pairing rather than the bare circle. package-capture screenshots with no
// animation control, so the frame it catches is arbitrary — freezing the animation pins the cell to
// the 0% keyframe (full opacity) and makes the shot deterministic.
const ChatLauncherStory = () => (
    <>
        <style>{`.ds-anim-still, .ds-anim-still * { animation-play-state: paused !important; }`}</style>
        <div className="ds-anim-still flex items-center gap-3">
            <RoundedIcon className="text-text-above-primary flex animate-pulse items-center justify-center">
                {chatGlyph}
            </RoundedIcon>
            <span className="text-accent text-2xl font-bold text-shadow-md">Ask the Oracle</span>
        </div>
    </>
);

const ActionRowStory = () => (
    <div className="flex flex-wrap gap-2">
        <RoundedIcon className="text-text-above-primary">{chatGlyph}</RoundedIcon>
        <RoundedIcon className="text-text-above-primary">{terminalGlyph}</RoundedIcon>
        <RoundedIcon className="text-text-above-primary">{arrowUpGlyph}</RoundedIcon>
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const ChatLauncher: Story = { render: () => <ChatLauncherStory /> };
export const ActionRow: Story = { render: () => <ActionRowStory /> };
