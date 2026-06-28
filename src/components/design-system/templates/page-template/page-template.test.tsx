import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageTemplate } from "./page-template";
import type { MenuNavHrefs } from "@/components/design-system/organism/menu";
import type { FooterNavHrefs, SocialContactLinks } from "@/components/design-system/organism/footer";

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

vi.mock("next/image", () => ({
    default: ({
        alt,
        src,
        ...rest
    }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => <img alt={alt} src={src} {...rest} />,
}));

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
}));

vi.mock("framer-motion", () => ({
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    motion: {
        div: ({ children, initial: _i, animate: _a, exit: _e, transition: _t, style: _s, ...props }: React.HTMLAttributes<HTMLDivElement> & { initial?: unknown; animate?: unknown; exit?: unknown; transition?: unknown }) => (
            <div {...props}>{children}</div>
        ),
        nav: ({ children, initial: _i, animate: _a, exit: _e, transition: _t, style: _s, ...props }: React.HTMLAttributes<HTMLElement> & { initial?: unknown; animate?: unknown; exit?: unknown; transition?: unknown }) => (
            <nav {...props}>{children}</nav>
        ),
    },
}));

vi.mock("matrix-rain-webgpu", () => ({
    isWebGPUSupported: () => false,
}));

vi.mock("@/components/design-system/state/command-palette/command-palette-events", () => ({
    commandPaletteOpenEvent: "command-palette-open",
    openCommandPalette: vi.fn(),
    openMatrixRainPanel: vi.fn(),
}));

vi.mock("@/components/design-system/state/motion/motion", () => ({
    writeMotion: vi.fn(),
    hasMotion: () => true,
    motionChangeEvent: "motion-change",
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

const footerNavHrefs: FooterNavHrefs = {
    blog: "/blog",
    art: "/art",
    aboutMe: "/about-me",
    archive: "/archive",
    tags: "/tags",
    contact: "/contact",
};

const socialLinks: SocialContactLinks = {
    github: "https://github.com/chicio",
    linkedin: "https://linkedin.com/in/chicio",
    medium: "https://medium.com/@chicio",
    devto: "https://dev.to/chicio",
    twitter: "https://twitter.com/chicio",
    facebook: "https://facebook.com/chicio",
    instagram: "https://instagram.com/chicio",
};

describe("PageTemplate", () => {
    describe("render", () => {
        it("renders the header slot", () => {
            render(
                <PageTemplate
                    header={<div data-testid="header-slot">Header</div>}
                    author="Fabrizio"
                    navHrefs={navHrefs}
                    footerNavHrefs={footerNavHrefs}
                    socialLinks={socialLinks}
                />,
            );
            expect(screen.getByTestId("header-slot")).toBeInTheDocument();
        });

        it("renders children content", () => {
            render(
                <PageTemplate
                    header={<div>Header</div>}
                    author="Fabrizio"
                    navHrefs={navHrefs}
                    footerNavHrefs={footerNavHrefs}
                    socialLinks={socialLinks}
                >
                    <p>Page content goes here</p>
                </PageTemplate>,
            );
            expect(screen.getByText("Page content goes here")).toBeInTheDocument();
        });

        it("renders the footer with author name", () => {
            render(
                <PageTemplate
                    header={<div>Header</div>}
                    author="Fabrizio Duroni"
                    navHrefs={navHrefs}
                    footerNavHrefs={footerNavHrefs}
                    socialLinks={socialLinks}
                />,
            );
            expect(screen.getByText(/Fabrizio Duroni/)).toBeInTheDocument();
        });

        it("renders navigation menu", () => {
            render(
                <PageTemplate
                    header={<div>Header</div>}
                    author="Fabrizio"
                    navHrefs={navHrefs}
                    footerNavHrefs={footerNavHrefs}
                    socialLinks={socialLinks}
                />,
            );
            expect(screen.getAllByRole("link", { name: "Home" }).length).toBeGreaterThan(0);
        });
    });
});
