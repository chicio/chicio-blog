import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menu } from "./menu";
import type { MenuNavHrefs } from "./menu";

vi.mock("next/navigation", () => ({
    usePathname: () => "/",
    useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next/link", () => ({
    default: ({
        href,
        children,
        ...rest
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} {...rest}>
            {children}
        </a>
    ),
}));

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div {...props}>{children}</div>
    ),
}));

vi.mock("framer-motion", () => ({
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    },
}));

const navHrefs: MenuNavHrefs = {
    blog: "/blog",
    blogAuthors: "/blog/authors",
    blogTags: "/blog/tags",
    blogArchive: "/blog/archive",
    dsaRoadmap: "/dsa/roadmap",
    dsaExercises: "/dsa/exercises",
    chat: "/chat",
    mcp: "/mcp",
    aboutMe: "/about-me",
    art: "/art",
    videogames: "/videogames",
    contact: "/contact",
};

describe("Menu", () => {
    describe("render", () => {
        it("renders the Home nav link", () => {
            render(<Menu navHrefs={navHrefs} />);
            const homeLinks = screen.getAllByRole("link", { name: "Home" });
            expect(homeLinks.length).toBeGreaterThan(0);
            expect(homeLinks[0]).toHaveAttribute("href", "/");
        });

        it("renders a Blog dropdown trigger", () => {
            render(<Menu navHrefs={navHrefs} />);
            const blogButtons = screen.getAllByRole("button", { name: "Blog" });
            expect(blogButtons.length).toBeGreaterThan(0);
        });

        it("lists Latest posts, Authors, Tags and Archive in the Blog dropdown, in order", async () => {
            render(<Menu navHrefs={navHrefs} />);
            await userEvent.click(screen.getAllByRole("button", { name: "Blog" })[0]);
            const menu = screen.getAllByRole("menu")[0];
            const items = within(menu).getAllByRole("link");
            expect(items.map((item) => item.textContent)).toEqual(["Latest posts", "Authors", "Tags", "Archive"]);
            expect(within(menu).getByRole("link", { name: "Latest posts" })).toHaveAttribute("href", "/blog");
            expect(within(menu).getByRole("link", { name: "Authors" })).toHaveAttribute("href", "/blog/authors");
            expect(within(menu).getByRole("link", { name: "Tags" })).toHaveAttribute("href", "/blog/tags");
            expect(within(menu).getByRole("link", { name: "Archive" })).toHaveAttribute("href", "/blog/archive");
        });

        it("renders the search button", () => {
            render(<Menu navHrefs={navHrefs} />);
            expect(screen.getByRole("button", { name: "Open command palette" })).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onPaletteTrigger when search button is clicked", async () => {
            const onPaletteTrigger = vi.fn();
            render(<Menu navHrefs={navHrefs} onPaletteTrigger={onPaletteTrigger} />);
            await userEvent.click(screen.getByRole("button", { name: "Open command palette" }));
            expect(onPaletteTrigger).toHaveBeenCalledOnce();
        });

        it("calls tracking callback when a Blog dropdown item is clicked", async () => {
            const onTrackBlogAuthors = vi.fn();
            render(<Menu navHrefs={navHrefs} tracking={{ onTrackBlogAuthors }} />);
            await userEvent.click(screen.getAllByRole("button", { name: "Blog" })[0]);
            const menu = screen.getAllByRole("menu")[0];
            await userEvent.click(within(menu).getByRole("link", { name: "Authors" }));
            expect(onTrackBlogAuthors).toHaveBeenCalledOnce();
        });
    });
});
