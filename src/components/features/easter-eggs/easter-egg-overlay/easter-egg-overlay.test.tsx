import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { EasterEggOverlay } from "./easter-egg-overlay";
import { closeEasterEgg, openEasterEgg } from "@/lib/easter-eggs/easter-egg-overlay-state";

const { mockUseReducedMotions } = vi.hoisted(() => ({
    mockUseReducedMotions: vi.fn().mockReturnValue(false),
}));

vi.mock("@/components/design-system/hooks/use-reduced-motions", () => ({
    useReducedMotions: mockUseReducedMotions,
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    },
}));

vi.mock("@/components/design-system/atoms/effects/matrix-rain/matrix-rain", () => ({
    MatrixRain: () => <div data-testid="matrix-rain" />,
}));

describe("EasterEggOverlay", () => {
    beforeEach(() => {
        mockUseReducedMotions.mockReturnValue(false);
        closeEasterEgg();
    });

    afterEach(() => {
        closeEasterEgg();
    });

    describe("when no egg is open", () => {
        it("renders nothing", () => {
            const { container } = render(<EasterEggOverlay />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe("when an egg opens", () => {
        it("renders the dialog with the egg title as its accessible name", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            expect(screen.getByRole("dialog", { name: "The One" })).toBeInTheDocument();
        });

        it("types the boot lines one character at a time before showing the video", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            expect(screen.queryByText(/playback ready/)).not.toBeInTheDocument();
        });

        it("reveals the video with the right src, poster and captions once boot completes", async () => {
            mockUseReducedMotions.mockReturnValue(true);
            const { container } = render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });

            const video = container.querySelector("video");
            expect(video).toHaveAttribute("aria-label", "The One");
            expect(video?.querySelector("source")).toHaveAttribute("src", "/media/video/the-one.mp4");
            expect(video).toHaveAttribute("poster", "/media/video/the-one-poster.jpg");
            expect(video?.querySelector("track")).toHaveAttribute("src", "/media/video/the-one.vtt");
        });

        it("shows the egg slug in the header", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("dodge-this");
            });
            expect(screen.getByText("dodge-this")).toBeInTheDocument();
        });
    });

    describe("under reduced motion", () => {
        it("renders all boot lines instantly instead of typing", () => {
            mockUseReducedMotions.mockReturnValue(true);
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            expect(screen.getByText(/playback ready/)).toBeInTheDocument();
        });
    });

    describe("dismissing", () => {
        it("closes when the esc button is clicked", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            fireEvent.click(screen.getByRole("button", { name: "Close" }));
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("closes on the Escape key", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            fireEvent.keyDown(window, { key: "Escape" });
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("closes when clicking the backdrop outside the card", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            fireEvent.click(screen.getByRole("dialog"));
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("does not close when clicking inside the card", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            fireEvent.click(screen.getByText("the-one"));
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });
    });

    describe("skipping the boot sequence", () => {
        it("jumps straight to the video on any keypress", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            fireEvent.keyDown(window, { key: "a" });
            expect(screen.getByText(/playback ready/)).toBeInTheDocument();
        });
    });
});
