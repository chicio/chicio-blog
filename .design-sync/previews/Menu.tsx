import { useEffect, useRef } from "react";
import { Menu } from "chicio-blog";

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

export const Default = () => <Menu navHrefs={navHrefs} />;

export const BlogDropdownOpen = () => {
    const ref = useDropdownOpenedOnMount("Blog");

    return (
        <div ref={ref}>
            <Menu navHrefs={navHrefs} />
        </div>
    );
};

export const ExploreDropdownOpen = () => {
    const ref = useDropdownOpenedOnMount("Explore");

    return (
        <div ref={ref}>
            <Menu navHrefs={navHrefs} />
        </div>
    );
};

export const AuthorDropdownOpen = () => {
    const ref = useDropdownOpenedOnMount("The Author");

    return (
        <div ref={ref}>
            <Menu navHrefs={navHrefs} />
        </div>
    );
};
