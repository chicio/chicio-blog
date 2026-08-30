import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu } from ".";
import { useEffect, useRef } from "react";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Organism/Menu",
    component: Menu,
};

export default meta;

type Story = StoryObj;

// The real site nav (src/components/features/content/nav-config.ts).
const navHrefs = {
    blog: "/blog",
    blogAuthors: "/blog/authors",
    blogAuthor: "/blog/author",
    blogTags: "/blog/tags",
    blogArchive: "/blog/archive",
    blogStats: "/blog/stats",
    dsaRoadmap: "/data-structures-and-algorithms/roadmap",
    dsaExercises: "/data-structures-and-algorithms/exercises",
    chat: "/chat",
    mcp: "/mcp",
    easterEggHunt: "/easter-egg-hunt",
    aboutMe: "/about-me",
    art: "/art",
    videogames: "/videogames",
    contact: "/contact",
};

// Menu owns its dropdowns' open state internally, so the cells that show a panel
// click the matching trigger on mount. Matching on the trigger's own label keeps
// the cell honest if the nav is reordered.
const useDropdownOpenedOnMount = (label: string) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const triggers = ref.current?.querySelectorAll<HTMLButtonElement>('button[aria-haspopup="menu"]');
        Array.from(triggers ?? [])
            .find((trigger) => (trigger.textContent ?? "").trim() === label)
            ?.click();
    }, [label]);

    return ref;
};

const DefaultStory = () => <Menu currentPath="/blog" navHrefs={navHrefs} />;

const BlogDropdownOpenStory = () => {
    const ref = useDropdownOpenedOnMount("Blog");

    return (
        <div ref={ref}>
            <Menu currentPath="/blog" navHrefs={navHrefs} />
        </div>
    );
};

const ExploreDropdownOpenStory = () => {
    const ref = useDropdownOpenedOnMount("Explore");

    return (
        <div ref={ref}>
            <Menu currentPath="/blog" navHrefs={navHrefs} />
        </div>
    );
};

const AuthorDropdownOpenStory = () => {
    const ref = useDropdownOpenedOnMount("The Author");

    return (
        <div ref={ref}>
            <Menu currentPath="/blog" navHrefs={navHrefs} />
        </div>
    );
};

export const Default: Story = { render: () => <DefaultStory /> };
export const BlogDropdownOpen: Story = { render: () => <BlogDropdownOpenStory /> };
export const ExploreDropdownOpen: Story = { render: () => <ExploreDropdownOpenStory /> };
export const AuthorDropdownOpen: Story = { render: () => <AuthorDropdownOpenStory /> };
