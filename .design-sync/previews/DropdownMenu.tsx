import { useEffect, useRef } from "react";
import { DropdownMenu } from "chicio-blog";

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

const blogItems = [
    { label: "Latest posts", to: "/blog", selected: false },
    { label: "Authors", to: "/blog/authors", selected: false },
    { label: "Tags", to: "/blog/tags", selected: false },
    { label: "Archive", to: "/blog/archive", selected: false },
    { label: "Stats", to: "/blog/stats", selected: false },
    { label: "Easter Eggs", to: "/easter-egg-hunt", selected: false },
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
        items: [
            { label: "Matrix Rain", to: "https://chicio.github.io/matrix-rain-webgpu/", external: true },
        ],
    },
];

const authorItems = [
    { label: "About me", to: "/about-me", selected: false },
    { label: "Art", to: "/art", selected: true },
    { label: "Videogames", to: "/videogames", selected: false },
    { label: "Contact me", to: "/contact", selected: false },
];

export const Closed = () => (
    <div className="flex text-primary-text">
        <DropdownMenu label="Blog" items={blogItems} />
    </div>
);

export const Open = () => {
    const ref = useOpenedOnMount();

    return (
        <div ref={ref} className="flex text-primary-text">
            <DropdownMenu label="Blog" items={blogItems} />
        </div>
    );
};

// Grouped entries: every entry carrying an `items` array renders as a labelled
// section with a divider between sections. This is the site's "Explore" menu.
export const Grouped = () => {
    const ref = useOpenedOnMount();

    return (
        <div ref={ref} className="flex text-primary-text">
            <DropdownMenu label="Explore" items={exploreItems} />
        </div>
    );
};

// When any entry is selected the trigger itself picks up the accent border and
// background, so the nav shows which section you are in even while closed.
export const WithSelectedEntry = () => {
    const ref = useOpenedOnMount();

    return (
        <div ref={ref} className="flex text-primary-text">
            <DropdownMenu label="The Author" items={authorItems} />
        </div>
    );
};
