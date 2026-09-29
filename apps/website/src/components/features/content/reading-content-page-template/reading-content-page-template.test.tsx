import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReadingContentPageTemplate } from "./reading-content-page-template";
import type { MenuEntry } from "@/components/features/design-system-next/menu";
import type { FooterLink, SocialContactLinks } from "@/components/features/design-system-next/footer";

vi.mock("next/navigation", () => ({
    usePathname: () => "/",
    useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next/link", () => ({
    default: ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} {...rest}>
            {children}
        </a>
    ),
}));

vi.mock("next/image", () => ({
    default: ({ alt, src, ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
        <img alt={alt} src={src} {...rest} />
    ),
}));

vi.mock("matrix-design-system", async (importOriginal) => ({
    ...(await importOriginal<typeof import("matrix-design-system")>()),
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    MatrixHeaderBackground: () => <div data-testid="matrix-header-background" />,
    ImageGlow: ({ alt, src, ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
        <img alt={alt} src={src} {...rest} />
    ),
    commandPaletteOpenEvent: "command-palette-open",
    openCommandPalette: vi.fn(),
    openMatrixRainPanel: vi.fn(),
    writeMotion: vi.fn(),
    hasMotion: () => true,
    motionChangeEvent: "motion-change",
}));
vi.mock("framer-motion", () => ({
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    motion: {
        div: ({
            children,
            initial: _i,
            animate: _a,
            exit: _e,
            transition: _t,
            style: _s,
            ...props
        }: React.HTMLAttributes<HTMLDivElement> & {
            initial?: unknown;
            animate?: unknown;
            exit?: unknown;
            transition?: unknown;
        }) => <div {...props}>{children}</div>,
        nav: ({
            children,
            initial: _i,
            animate: _a,
            exit: _e,
            transition: _t,
            style: _s,
            ...props
        }: React.HTMLAttributes<HTMLElement> & {
            initial?: unknown;
            animate?: unknown;
            exit?: unknown;
            transition?: unknown;
        }) => <nav {...props}>{children}</nav>,
    },
}));

vi.mock("matrix-rain-webgpu", () => ({
    isWebGPUSupported: () => false,
    MatrixRainWebGPU: () => <div data-testid="matrix-rain-webgpu" />,
}));

beforeAll(() => {
    vi.stubGlobal(
        "IntersectionObserver",
        class {
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
        },
    );
});

const menuEntries: MenuEntry[] = [
    { label: "Home", to: "/" },
    {
        label: "The Author",
        groups: [{ label: "Hobbies", items: [{ label: "Manga", to: "/manga" }] }],
    },
];

const footerLinks: FooterLink[] = [
    { label: "Home", to: "/" },
    { label: "Blog", to: "/blog" },
];

const contactHref = "/contact";

const socialLinks: SocialContactLinks = {
    github: "https://github.com/chicio",
    linkedin: "https://linkedin.com/in/chicio",
    medium: "https://medium.com/@chicio",
    devto: "https://dev.to/chicio",
    twitter: "https://twitter.com/chicio",
    facebook: "https://facebook.com/chicio",
    instagram: "https://instagram.com/chicio",
};

describe("ReadingContentPageTemplate", () => {
    describe("render", () => {
        it("renders the reading progress bar", () => {
            render(
                <ReadingContentPageTemplate
                    author="Fabrizio"
                    menuEntries={menuEntries}
                    footerLinks={footerLinks}
                    contactHref={contactHref}
                    socialLinks={socialLinks}
                />,
            );
            expect(screen.getByText(/Uploading knowledge/)).toBeInTheDocument();
        });

        it("renders children content", () => {
            render(
                <ReadingContentPageTemplate
                    author="Fabrizio"
                    menuEntries={menuEntries}
                    footerLinks={footerLinks}
                    contactHref={contactHref}
                    socialLinks={socialLinks}
                >
                    <article>Article body</article>
                </ReadingContentPageTemplate>,
            );
            expect(screen.getByText("Article body")).toBeInTheDocument();
        });

        it("renders breadcrumbs when provided", () => {
            render(
                <ReadingContentPageTemplate
                    author="Fabrizio"
                    menuEntries={menuEntries}
                    footerLinks={footerLinks}
                    contactHref={contactHref}
                    socialLinks={socialLinks}
                    breadcrumbs={[
                        { label: "Blog", href: "/blog", isCurrent: false },
                        { label: "My Article", href: "/blog/my-article", isCurrent: true },
                    ]}
                />,
            );
            expect(screen.getAllByText("Blog").length).toBeGreaterThan(0);
            expect(screen.getAllByText("My Article").length).toBeGreaterThan(0);
        });

        it("renders beforeContent and afterContent slots", () => {
            render(
                <ReadingContentPageTemplate
                    author="Fabrizio"
                    menuEntries={menuEntries}
                    footerLinks={footerLinks}
                    contactHref={contactHref}
                    socialLinks={socialLinks}
                    beforeContent={<div>Before content</div>}
                    afterContent={<div>After content</div>}
                />,
            );
            expect(screen.getByText("Before content")).toBeInTheDocument();
            expect(screen.getByText("After content")).toBeInTheDocument();
        });
    });
});
