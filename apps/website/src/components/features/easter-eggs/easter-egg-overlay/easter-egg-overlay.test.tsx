import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { EasterEggOverlay } from "./easter-egg-overlay";
import { closeEasterEgg, openEasterEgg } from "@/lib/easter-eggs/easter-egg-overlay-state";

const { mockUseReducedMotions } = vi.hoisted(() => ({
    mockUseReducedMotions: vi.fn().mockReturnValue(false),
}));

vi.mock("matrix-design-system", async (importOriginal) => ({
    ...(await importOriginal<typeof import("matrix-design-system")>()),
    useReducedMotions: mockUseReducedMotions,
    MatrixRain: () => <div data-testid="matrix-rain" />,
}));
vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    },
}));

/**
 * Chained setTimeout-driven state updates (one per typed character) only advance if React gets to
 * re-render and reschedule the next timer between each tick — a single large `advanceTimersByTime`
 * call does not drive that chain. Polling in small increments (mirroring use-typewriter.test.ts's
 * own `advanceUntil` helper) is the working pattern in this codebase.
 */
const advanceUntil = async (predicate: () => boolean, stepMs = 20, maxIterations = 400) => {
    for (let i = 0; i < maxIterations; i++) {
        if (predicate()) {
            return;
        }
        await act(async () => {
            vi.advanceTimersByTime(stepMs);
        });
    }
};

describe("EasterEggOverlay", () => {
    beforeEach(() => {
        mockUseReducedMotions.mockReturnValue(false);
        closeEasterEgg();
    });

    afterEach(() => {
        closeEasterEgg();
        vi.useRealTimers();
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

        it("types the boot lines progressively, completing only after enough time has passed", async () => {
            vi.useFakeTimers();
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });

            const textNow = () => screen.getByRole("dialog").textContent ?? "";

            await advanceUntil(() => textNow().includes("$"));
            const early = textNow();
            expect(early).not.toContain("playback ready");

            await advanceUntil(() => textNow().length > early.length);
            const later = textNow();
            expect(later.length).toBeGreaterThan(early.length);
            expect(later).not.toContain("playback ready");

            await advanceUntil(() => textNow().includes("playback ready"));
            expect(textNow()).toContain("playback ready");
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

    describe("audio and playback position while hidden behind the boot terminal", () => {
        it("mutes the video while boot is running, then unmutes and resets currentTime on reveal", async () => {
            vi.useFakeTimers();
            const { container } = render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });

            const video = container.querySelector("video") as HTMLVideoElement;
            expect(video.muted).toBe(true);

            // Simulate the clip having already played a couple of seconds ahead while hidden.
            video.currentTime = 2.7;

            await advanceUntil(() => !video.muted);

            expect(video.muted).toBe(false);
            expect(video.currentTime).toBe(0);
        });

        it("unmutes and resets currentTime when the boot is skipped by a keypress", () => {
            const { container } = render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });

            const video = container.querySelector("video") as HTMLVideoElement;
            expect(video.muted).toBe(true);
            video.currentTime = 0.57;

            fireEvent.keyDown(window, { key: "a" });

            expect(video.muted).toBe(false);
            expect(video.currentTime).toBe(0);
        });

        it("does not reset currentTime again on subsequent re-renders once revealed", async () => {
            const { container } = render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });

            const video = container.querySelector("video") as HTMLVideoElement;
            fireEvent.keyDown(window, { key: "a" });
            expect(video.currentTime).toBe(0);

            // Simulate normal playback continuing after the reveal — a further click on the card
            // (which no longer means "skip", since boot already completed) must not rewind it again.
            video.currentTime = 12;
            fireEvent.click(screen.getByText("the-one"));

            expect(video.currentTime).toBe(12);
        });
    });

    describe("opening a second egg after closing the first", () => {
        it("types the boot lines from scratch instead of reusing the first egg's finished state", async () => {
            vi.useFakeTimers();
            const { container } = render(<EasterEggOverlay />);
            const textNow = () => screen.getByRole("dialog").textContent ?? "";

            act(() => {
                openEasterEgg("the-one");
            });
            await advanceUntil(() => textNow().includes("playback ready"));
            expect(textNow()).toContain("playback ready");

            const firstVideo = container.querySelector("video") as HTMLVideoElement;
            await advanceUntil(() => !firstVideo.muted);

            act(() => {
                closeEasterEgg();
            });
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

            act(() => {
                openEasterEgg("dodge-this");
            });

            const justOpened = textNow();
            expect(justOpened).not.toContain("playback ready");

            const secondVideo = container.querySelector("video") as HTMLVideoElement;
            expect(secondVideo.muted).toBe(true);

            await advanceUntil(() => textNow().includes("playback ready"));
            expect(textNow()).toContain("playback ready");
        });
    });

    describe("opening a second egg directly, without an intervening close", () => {
        it("still types the boot lines from scratch, defended by the key on BootTerminal", async () => {
            vi.useFakeTimers();
            render(<EasterEggOverlay />);
            const textNow = () => screen.getByRole("dialog").textContent ?? "";

            act(() => {
                openEasterEgg("the-one");
            });
            await advanceUntil(() => textNow().includes("playback ready"));
            expect(textNow()).toContain("playback ready");

            // No closeEasterEgg() in between — this is what the replay button does when a second
            // egg is opened while the overlay is still showing an earlier one.
            act(() => {
                openEasterEgg("dodge-this");
            });

            expect(textNow()).not.toContain("playback ready");

            await advanceUntil(() => textNow().includes("playback ready"));
            expect(textNow()).toContain("playback ready");
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

    describe("focus management", () => {
        it("moves focus to the dialog container, not the close button, when it opens", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            expect(document.activeElement).toBe(screen.getByRole("dialog"));
            expect(document.activeElement).not.toBe(screen.getByRole("button", { name: "Close" }));
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

        it("does not close the dialog when Enter is pressed during boot", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            fireEvent.keyDown(window, { key: "Enter" });
            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(screen.getByText(/playback ready/)).toBeInTheDocument();
        });

        it("does not close the dialog when Space is pressed during boot", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            fireEvent.keyDown(window, { key: " " });
            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(screen.getByText(/playback ready/)).toBeInTheDocument();
        });

        it("jumps straight to the video when the card is clicked", () => {
            render(<EasterEggOverlay />);
            act(() => {
                openEasterEgg("the-one");
            });
            fireEvent.click(screen.getByText("the-one"));
            expect(screen.getByText(/playback ready/)).toBeInTheDocument();
        });
    });
});
