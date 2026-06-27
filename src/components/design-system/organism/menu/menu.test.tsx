import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

        it("renders the Blog nav link", () => {
            render(<Menu navHrefs={navHrefs} />);
            const blogLinks = screen.getAllByRole("link", { name: "Blog" });
            expect(blogLinks.length).toBeGreaterThan(0);
            expect(blogLinks[0]).toHaveAttribute("href", "/blog");
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

        it("calls tracking callback when a nav link is clicked", async () => {
            const onTrackBlog = vi.fn();
            render(<Menu navHrefs={navHrefs} tracking={{ onTrackBlog }} />);
            const blogLinks = screen.getAllByRole("link", { name: "Blog" });
            await userEvent.click(blogLinks[0]);
            expect(onTrackBlog).toHaveBeenCalledOnce();
        });
    });
});
