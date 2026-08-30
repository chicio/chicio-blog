import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cursor } from "../../../atoms/typography/terminal-blocks";
import { MatrixHeaderBackground } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Effects/Matrix Header Background",
    component: MatrixHeaderBackground,
};

export default meta;

type Story = StoryObj;

// The Cursor blink is a CSS keyframe animation and the capture freezes the page clock, so an
// unpaused cursor photographs at whatever frame it happens to be in (often the transparent half).
// Pausing it pins it to the 0% keyframe, where it is visible.
const freeze = `.ds-still, .ds-still * { animation-play-state: paused !important; }`;

// The component is an absolutely positioned, -z-10 backdrop: on its own it paints nothing you can
// frame. Each cell gives it a sized positioned box and puts real header content on top of it, the
// way BrandHeader does on every page of the site.
const CompactStory = () => (
    <div className="ds-still relative h-64 w-full overflow-hidden">
        <style>{freeze}</style>
        <MatrixHeaderBackground big={false} />
        <div className="flex items-center pt-6">
            <div className="glassmorphism-lite-no-scale z-30 w-full p-5">
                <span className="text-accent m-0 block font-mono text-2xl font-bold uppercase text-shadow-lg">
                    <span className="text-shadow-md">{"> "}</span>CHICIO CODING
                    <Cursor />
                </span>
                <span className="text-primary-text font-mono text-xs font-normal text-shadow-md">
                    Pixels. Code. Unplugged.
                </span>
            </div>
        </div>
    </div>
);

const BigStory = () => (
    <div className="ds-still relative h-96 w-full overflow-hidden">
        <style>{freeze}</style>
        <MatrixHeaderBackground big={true} />
        <div className="flex items-center pt-8">
            <div className="glassmorphism-lite-no-scale z-30 w-full p-5">
                <span className="text-accent m-0 block font-mono text-2xl font-bold uppercase text-shadow-lg">
                    <span className="text-shadow-md">{"> "}</span>CHICIO CODING
                    <Cursor />
                </span>
                <span className="text-primary-text font-mono text-xs font-normal text-shadow-md">
                    Pixels. Code. Unplugged.
                </span>
            </div>
        </div>
    </div>
);

const BehindAPageTitleStory = () => (
    <div className="ds-still relative h-64 w-full overflow-hidden">
        <style>{freeze}</style>
        <MatrixHeaderBackground big={false} />
        <div className="flex flex-col gap-3 pt-8">
            <span className="text-accent font-mono text-2xl font-bold uppercase text-shadow-lg">Data structures</span>
            <span className="text-primary-text font-mono text-sm font-bold text-shadow-md">
                {"> "}96 articles · 287 lessons
                <Cursor />
            </span>
        </div>
    </div>
);

export const Compact: Story = { render: () => <CompactStory /> };
export const Big: Story = { render: () => <BigStory /> };
export const BehindAPageTitle: Story = { render: () => <BehindAPageTitleStory /> };
