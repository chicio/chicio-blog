import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EasterEggs } from "./easter-eggs";
import { easterEggHints, easterEggHuntIntroLines } from "@/lib/content/easter-eggs/easter-eggs-content";

vi.mock("next/navigation", () => ({
    usePathname: () => "/easter-egg-hunt",
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

vi.mock("@/components/design-system/molecules/effects/matrix-terminal", () => ({
    MatrixTerminal: ({ lines }: { lines: { text: string }[] }) => (
        <div data-testid="matrix-terminal">
            {lines.map((line) => (
                <p key={line.text}>{line.text}</p>
            ))}
        </div>
    ),
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

describe("EasterEggs", () => {
    describe("intro", () => {
        it("renders every intro line", () => {
            render(<EasterEggs />);
            easterEggHuntIntroLines.forEach((line) => {
                expect(screen.getByText(line)).toBeInTheDocument();
            });
        });
    });

    describe("egg cards", () => {
        it("renders both card titles and cryptic hints", () => {
            render(<EasterEggs />);
            easterEggHints.forEach((hint) => {
                expect(screen.getByText(new RegExp(hint.title))).toBeInTheDocument();
                expect(screen.getByText(hint.crypticHint)).toBeInTheDocument();
            });
        });

        it("does not show any solution steps before revealing", () => {
            render(<EasterEggs />);
            easterEggHints.forEach((hint) => {
                hint.solutionSteps.forEach((step) => {
                    expect(screen.queryByText(step)).not.toBeInTheDocument();
                });
            });
        });

        it("reveals the solution steps for a card when [reveal] is clicked", () => {
            render(<EasterEggs />);
            const [firstHint] = easterEggHints;
            const revealButtons = screen.getAllByText("[reveal]");
            fireEvent.click(revealButtons[0]);
            firstHint.solutionSteps.forEach((step) => {
                expect(screen.getByText(step)).toBeInTheDocument();
            });
        });

        it("hides the solution steps again when toggled a second time", () => {
            render(<EasterEggs />);
            const [firstHint] = easterEggHints;
            const revealButtons = screen.getAllByText("[reveal]");
            fireEvent.click(revealButtons[0]);
            fireEvent.click(screen.getAllByText("[hide]")[0]);
            firstHint.solutionSteps.forEach((step) => {
                expect(screen.queryByText(step)).not.toBeInTheDocument();
            });
        });

        it("only reveals the toggled card, leaving the other collapsed", () => {
            render(<EasterEggs />);
            const [, secondHint] = easterEggHints;
            const revealButtons = screen.getAllByText("[reveal]");
            fireEvent.click(revealButtons[0]);
            secondHint.solutionSteps.forEach((step) => {
                expect(screen.queryByText(step)).not.toBeInTheDocument();
            });
        });
    });
});
