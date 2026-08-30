import type { Meta, StoryObj } from "@storybook/react-vite";
import { CommandPalette, CommandPaletteGroup, CommandPaletteItem, ToggleMotionItem } from ".";
import { openCommandPalette } from "../../state/command-palette/command-palette-events";
import { useEffect, useRef } from "react";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Organism/Command Palette",
    component: CommandPalette,
};

export default meta;

type Story = StoryObj;

// CommandPalette has no `open` prop: it opens on Cmd/Ctrl+K, or on the `command-palette-open`
// event that the menu's search button fires. Each story dispatches that event on mount so the
// palette appears the way a reader actually meets it.
const useOpenedOnMount = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        openCommandPalette();
    }, []);

    return ref;
};

const ClosedStory = () => (
    <div className="text-primary-text flex min-h-40 items-center justify-center">
        <p className="font-mono">Press ⌘K — the palette is closed until it is opened.</p>
        <CommandPalette>
            <CommandPaletteGroup label="Navigation">
                <CommandPaletteItem value="blog">Blog</CommandPaletteItem>
            </CommandPaletteGroup>
        </CommandPalette>
    </div>
);

const OpenStory = () => {
    const ref = useOpenedOnMount();

    return (
        <div ref={ref} className="min-h-96">
            <CommandPalette>
                <CommandPaletteGroup label="Navigation">
                    <CommandPaletteItem value="blog">Blog</CommandPaletteItem>
                    <CommandPaletteItem value="about me">About me</CommandPaletteItem>
                    <CommandPaletteItem value="contact">Contact</CommandPaletteItem>
                </CommandPaletteGroup>
                <CommandPaletteGroup label="Actions">
                    <ToggleMotionItem />
                </CommandPaletteGroup>
            </CommandPalette>
        </div>
    );
};

const CustomPlaceholderStory = () => {
    const ref = useOpenedOnMount();

    return (
        <div ref={ref} className="min-h-96">
            <CommandPalette placeholder="search the archive_">
                <CommandPaletteGroup label="Archive">
                    <CommandPaletteItem value="2026">2026 posts</CommandPaletteItem>
                    <CommandPaletteItem value="2025">2025 posts</CommandPaletteItem>
                </CommandPaletteGroup>
            </CommandPalette>
        </div>
    );
};

export const Closed: Story = { render: () => <ClosedStory /> };
export const Open: Story = { render: () => <OpenStory /> };
export const CustomPlaceholder: Story = { render: () => <CustomPlaceholderStory /> };
