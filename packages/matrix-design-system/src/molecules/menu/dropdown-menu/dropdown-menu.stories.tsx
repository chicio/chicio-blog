import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenu } from ".";
import { useEffect, useRef } from "react";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Molecules/Menu/Dropdown Menu",
    component: DropdownMenu,
};

export default meta;

type Story = StoryObj;

// A closed DropdownMenu is just its trigger button, so the interesting cells open
// themselves on mount: the panel only exists after the trigger is clicked, and a
// preview has no interaction. Programmatic .click() does not move focus, so the
// component's own blur-to-close handler never fires and the panel stays open.
const useOpenedOnMount = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')?.click();
    }, []);

    return ref;
};

// Grouped to match what Menu actually passes: Posts / Discovery / Insights. The preview this was
// converted from still used the flat item list from before sections were introduced, which is why
// it rendered in Claude Design but would no longer compile.
const blogItems = [
    {
        label: "Posts",
        items: [
            { label: "Latest posts", to: "/blog", selected: false },
            { label: "Archive", to: "/blog/archive", selected: false },
        ],
    },
    {
        label: "Discovery",
        items: [
            { label: "Authors", to: "/blog/authors", selected: false },
            { label: "Tags", to: "/blog/tags", selected: false },
            { label: "Easter Eggs", to: "/easter-egg-hunt", selected: false },
        ],
    },
    {
        label: "Insights",
        items: [{ label: "Stats", to: "/blog/stats", selected: false }],
    },
];

const exploreItems = [
    {
        label: "DSA",
        items: [
            { label: "Roadmap", to: "/data-structures-and-algorithms/roadmap", selected: false },
            { label: "Exercises", to: "/data-structures-and-algorithms/exercises", selected: false },
        ],
    },
    {
        label: "Artificial Intelligence",
        items: [
            { label: "Chat", to: "/chat", selected: false },
            { label: "MCP", to: "/mcp", selected: false },
        ],
    },
    {
        label: "Computer Graphics",
        items: [{ label: "Matrix Rain", to: "https://chicio.github.io/matrix-rain-webgpu/", external: true }],
    },
];

const authorItems = [
    {
        label: "Me",
        items: [
            { label: "About me", to: "/about-me", selected: false },
            { label: "Contact me", to: "/contact", selected: false },
        ],
    },
    {
        label: "Things I make",
        items: [
            { label: "Art", to: "/art", selected: true },
            { label: "Videogames", to: "/videogames", selected: false },
        ],
    },
];

const ClosedStory = () => (
    <div className="text-primary-text flex">
        <DropdownMenu label="Blog" items={blogItems} />
    </div>
);

const OpenStory = () => {
    const ref = useOpenedOnMount();

    return (
        <div ref={ref} className="text-primary-text flex">
            <DropdownMenu label="Blog" items={blogItems} />
        </div>
    );
};

// Grouped entries: every entry carrying an `items` array renders as a labelled
// section with a divider between sections. This is the site's "Explore" menu.
const GroupedStory = () => {
    const ref = useOpenedOnMount();

    return (
        <div ref={ref} className="text-primary-text flex">
            <DropdownMenu label="Explore" items={exploreItems} />
        </div>
    );
};

// When any entry is selected the trigger itself picks up the accent border and
// background, so the nav shows which section you are in even while closed.
const WithSelectedEntryStory = () => {
    const ref = useOpenedOnMount();

    return (
        <div ref={ref} className="text-primary-text flex">
            <DropdownMenu label="The Author" items={authorItems} />
        </div>
    );
};

export const Closed: Story = { render: () => <ClosedStory /> };
export const Open: Story = { render: () => <OpenStory /> };
export const Grouped: Story = { render: () => <GroupedStory /> };
export const WithSelectedEntry: Story = { render: () => <WithSelectedEntryStory /> };
