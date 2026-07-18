import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menu } from "./menu";
import type { MenuNavHrefs } from "./menu";
import type { MenuTrackingCallbacks } from "./use-menu-store";
import { ScrollDirection } from "@/components/design-system/hooks/use-scroll-direction";

let mockPathname = "/";
let mockScrollDirection: ScrollDirection = ScrollDirection.up;
let mockModifierKey: "meta" | "ctrl" | null = null;
const openCommandPaletteMock = vi.fn();

vi.mock("next/navigation", () => ({
    usePathname: () => mockPathname,
    useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/components/design-system/hooks/use-scroll-direction", async () => {
    const actual = await vi.importActual<typeof import("@/components/design-system/hooks/use-scroll-direction")>(
        "@/components/design-system/hooks/use-scroll-direction",
    );
    return {
        ...actual,
        useScrollDirection: () => mockScrollDirection,
    };
});

vi.mock("@/components/design-system/hooks/use-os-modifier-key", () => ({
    useOsModifierKey: () => mockModifierKey,
}));

vi.mock("@/components/design-system/state/command-palette/command-palette-events", () => ({
    openCommandPalette: () => openCommandPaletteMock(),
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
    blogAuthor: "/blog/author",
    blogTags: "/blog/tags",
    blogArchive: "/blog/archive",
    blogStats: "/blog/stats",
    dsaRoadmap: "/dsa/roadmap",
    dsaExercises: "/dsa/exercises",
    chat: "/chat",
    mcp: "/mcp",
    easterEggHunt: "/easter-egg-hunt",
    aboutMe: "/about-me",
    art: "/art",
    videogames: "/videogames",
    contact: "/contact",
};

afterEach(() => {
    mockPathname = "/";
    mockScrollDirection = ScrollDirection.up;
    mockModifierKey = null;
    openCommandPaletteMock.mockClear();
});

const openMobileMenu = async (container: HTMLElement) => {
    const hamburgerWrapper = container.querySelector('div[class="sm:hidden"]');
    const icon = hamburgerWrapper?.querySelector<SVGElement>("svg");
    await userEvent.click(icon!);
};

const getMobilePanel = (container: HTMLElement) =>
    container.querySelector<HTMLElement>('[class*="touch-pan-y"]');

interface NavCase {
    label: string;
    trackingKey: keyof MenuTrackingCallbacks;
    dropdown?: "Blog" | "Explore" | "The Author";
}

const navCases: NavCase[] = [
    { label: "Home", trackingKey: "onTrackHome" },
    { label: "Latest posts", trackingKey: "onTrackBlog", dropdown: "Blog" },
    { label: "Tags", trackingKey: "onTrackBlogTags", dropdown: "Blog" },
    { label: "Archive", trackingKey: "onTrackBlogArchive", dropdown: "Blog" },
    { label: "Easter Eggs", trackingKey: "onTrackEasterEggHunt", dropdown: "Blog" },
    { label: "Roadmap", trackingKey: "onTrackDsaRoadmap", dropdown: "Explore" },
    { label: "Exercises", trackingKey: "onTrackDsaExercises", dropdown: "Explore" },
    { label: "Chat", trackingKey: "onTrackChat", dropdown: "Explore" },
    { label: "MCP", trackingKey: "onTrackMcp", dropdown: "Explore" },
    { label: "Matrix Rain", trackingKey: "onTrackMatrixRain", dropdown: "Explore" },
    { label: "About me", trackingKey: "onTrackAboutMe", dropdown: "The Author" },
    { label: "Art", trackingKey: "onTrackArt", dropdown: "The Author" },
    { label: "Videogames", trackingKey: "onTrackVideogames", dropdown: "The Author" },
    { label: "Contact me", trackingKey: "onTrackContact", dropdown: "The Author" },
];

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

        it("lists Latest posts, Authors, Tags, Archive and Stats in the Blog dropdown, in order", async () => {
            render(<Menu navHrefs={navHrefs} />);
            await userEvent.click(screen.getAllByRole("button", { name: "Blog" })[0]);
            const menu = screen.getAllByRole("menu")[0];
            const items = within(menu).getAllByRole("link");
            expect(items.map((item) => item.textContent)).toEqual([
                "Latest posts",
                "Authors",
                "Tags",
                "Archive",
                "Stats",
                "Easter Eggs",
            ]);
            expect(within(menu).getByRole("link", { name: "Latest posts" })).toHaveAttribute("href", "/blog");
            expect(within(menu).getByRole("link", { name: "Authors" })).toHaveAttribute("href", "/blog/authors");
            expect(within(menu).getByRole("link", { name: "Tags" })).toHaveAttribute("href", "/blog/tags");
            expect(within(menu).getByRole("link", { name: "Archive" })).toHaveAttribute("href", "/blog/archive");
            expect(within(menu).getByRole("link", { name: "Stats" })).toHaveAttribute("href", "/blog/stats");
            expect(within(menu).getByRole("link", { name: "Easter Eggs" })).toHaveAttribute(
                "href",
                "/easter-egg-hunt",
            );
        });

        it("marks Authors as selected when on an author detail page", async () => {
            mockPathname = "/blog/author/francesco-bonfadelli";
            render(<Menu navHrefs={navHrefs} />);
            await userEvent.click(screen.getAllByRole("button", { name: "Blog" })[0]);
            const menu = screen.getAllByRole("menu")[0];
            expect(within(menu).getByRole("link", { name: "Authors" })).toHaveClass("border-accent");
        });

        it("does not mark Authors as selected on an unrelated page", async () => {
            mockPathname = "/contact";
            render(<Menu navHrefs={navHrefs} />);
            await userEvent.click(screen.getAllByRole("button", { name: "Blog" })[0]);
            const menu = screen.getAllByRole("menu")[0];
            expect(within(menu).getByRole("link", { name: "Authors" })).not.toHaveClass("border-accent");
        });

        it("renders the search button", () => {
            render(<Menu navHrefs={navHrefs} />);
            expect(screen.getByRole("button", { name: "Open command palette" })).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onPaletteTrigger and opens the command palette when search button is clicked", async () => {
            const onPaletteTrigger = vi.fn();
            render(<Menu navHrefs={navHrefs} onPaletteTrigger={onPaletteTrigger} />);
            await userEvent.click(screen.getByRole("button", { name: "Open command palette" }));
            expect(onPaletteTrigger).toHaveBeenCalledOnce();
            expect(openCommandPaletteMock).toHaveBeenCalledOnce();
        });

        it("opens the command palette even without an onPaletteTrigger prop", async () => {
            render(<Menu navHrefs={navHrefs} />);
            await userEvent.click(screen.getByRole("button", { name: "Open command palette" }));
            expect(openCommandPaletteMock).toHaveBeenCalledOnce();
        });

        it("calls tracking callback when a Blog dropdown item is clicked", async () => {
            const onTrackBlogAuthors = vi.fn();
            render(<Menu navHrefs={navHrefs} tracking={{ onTrackBlogAuthors }} />);
            await userEvent.click(screen.getAllByRole("button", { name: "Blog" })[0]);
            const menu = screen.getAllByRole("menu")[0];
            await userEvent.click(within(menu).getByRole("link", { name: "Authors" }));
            expect(onTrackBlogAuthors).toHaveBeenCalledOnce();
        });

        it("calls tracking callback when the Stats dropdown item is clicked", async () => {
            const onTrackBlogStats = vi.fn();
            render(<Menu navHrefs={navHrefs} tracking={{ onTrackBlogStats }} />);
            await userEvent.click(screen.getAllByRole("button", { name: "Blog" })[0]);
            const menu = screen.getAllByRole("menu")[0];
            await userEvent.click(within(menu).getByRole("link", { name: "Stats" }));
            expect(onTrackBlogStats).toHaveBeenCalledOnce();
        });
    });

    describe("mobile menu", () => {
        it("opens the mobile menu when the hamburger icon is clicked", async () => {
            const { container } = render(<Menu navHrefs={navHrefs} />);
            expect(getMobilePanel(container)).toBeNull();
            await openMobileMenu(container);
            expect(getMobilePanel(container)).not.toBeNull();
        });

        it("closes the mobile menu when the close icon is clicked", async () => {
            const { container } = render(<Menu navHrefs={navHrefs} />);
            await openMobileMenu(container);
            const mobilePanel = getMobilePanel(container)!;
            const closeIcon = mobilePanel.querySelector<SVGElement>(
                'div[class="absolute top-2.5 left-2.5"] svg',
            )!;
            await userEvent.click(closeIcon);
            expect(getMobilePanel(container)).toBeNull();
        });
    });

    describe("navigation tracking", () => {
        it.each(navCases)(
            "tracks $trackingKey and closes the mobile menu when $label is clicked",
            async ({ label, trackingKey, dropdown }) => {
                const trackingFn = vi.fn();
                const tracking: MenuTrackingCallbacks = { [trackingKey]: trackingFn };
                const { container } = render(<Menu navHrefs={navHrefs} tracking={tracking} />);
                await openMobileMenu(container);
                const mobilePanel = getMobilePanel(container)!;

                if (dropdown) {
                    await userEvent.click(within(mobilePanel).getByRole("button", { name: dropdown }));
                }
                await userEvent.click(within(mobilePanel).getByRole("link", { name: label }));

                expect(trackingFn).toHaveBeenCalledOnce();
                expect(getMobilePanel(container)).toBeNull();
            },
        );
    });

    describe("hide on scroll", () => {
        it("hides the menu bar when scrolling down on a non-chat page", () => {
            mockPathname = "/blog";
            mockScrollDirection = ScrollDirection.down;
            const { container } = render(<Menu navHrefs={navHrefs} />);
            const menuBar = container.querySelector(".menu-container");
            expect(menuBar).toHaveAttribute("animate", "hidden");
        });

        it("keeps the menu bar visible when scrolling up", () => {
            mockPathname = "/blog";
            mockScrollDirection = ScrollDirection.up;
            const { container } = render(<Menu navHrefs={navHrefs} />);
            const menuBar = container.querySelector(".menu-container");
            expect(menuBar).toHaveAttribute("animate", "visible");
        });

        it("keeps the menu bar visible on the chat page even when scrolling down", () => {
            mockPathname = navHrefs.chat;
            mockScrollDirection = ScrollDirection.down;
            const { container } = render(<Menu navHrefs={navHrefs} />);
            const menuBar = container.querySelector(".menu-container");
            expect(menuBar).toHaveAttribute("animate", "visible");
        });
    });

    describe("os modifier key shortcut badge", () => {
        it("shows the K shortcut badge when a modifier key is detected", () => {
            mockModifierKey = "meta";
            render(<Menu navHrefs={navHrefs} />);
            expect(screen.getByText("K")).toBeInTheDocument();
        });

        it("hides the shortcut badge when no modifier key is detected", () => {
            mockModifierKey = null;
            render(<Menu navHrefs={navHrefs} />);
            expect(screen.queryByText("K")).not.toBeInTheDocument();
        });
    });
});
