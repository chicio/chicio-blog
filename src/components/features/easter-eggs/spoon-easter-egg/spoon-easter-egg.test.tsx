import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";
import { fireEvent, act } from "@testing-library/react";
import { SpoonEasterEgg } from "./spoon-easter-egg";
import { SPOON_PHRASE } from "@/lib/easter-eggs/spoon-phrase-buffer";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";

const { mockUseReducedMotions } = vi.hoisted(() => ({
    mockUseReducedMotions: vi.fn().mockReturnValue(false),
}));

vi.mock("@/components/design-system/hooks/use-reduced-motions", () => ({
    useReducedMotions: mockUseReducedMotions,
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
            ...props
        }: React.HTMLAttributes<HTMLDivElement> & {
            initial?: unknown;
            animate?: unknown;
            exit?: unknown;
            transition?: unknown;
        }) => <div {...props}>{children}</div>,
    },
}));

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

vi.mock("./spoon-matrix-rain", () => ({
    SpoonMatrixRain: () => <div data-testid="spoon-matrix-rain" />,
}));

const typeSpoonPhrase = (target: Document | HTMLElement = document) => {
    SPOON_PHRASE.split("").forEach((char) => {
        fireEvent.keyDown(target, { key: char });
    });
};

describe("SpoonEasterEgg", () => {
    beforeEach(() => {
        mockUseReducedMotions.mockReturnValue(false);
        vi.mocked(trackWith).mockClear();
        document.body.classList.remove("glitch-active");
    });

    describe("before the phrase is typed", () => {
        it("renders nothing", () => {
            render(<SpoonEasterEgg />);
            expect(screen.queryByTestId("spoon-matrix-rain")).not.toBeInTheDocument();
        });
    });

    describe("when the phrase is typed on the page body", () => {
        it("adds the glitch-active class then shows the rain overlay", async () => {
            vi.useFakeTimers();
            render(<SpoonEasterEgg />);

            typeSpoonPhrase();
            expect(document.body.classList.contains("glitch-active")).toBe(true);
            expect(screen.queryByTestId("spoon-matrix-rain")).not.toBeInTheDocument();

            await act(async () => {
                vi.advanceTimersByTime(400);
            });

            expect(document.body.classList.contains("glitch-active")).toBe(false);
            expect(screen.getByTestId("spoon-matrix-rain")).toBeInTheDocument();
            vi.useRealTimers();
        });

        it("reforms (hides the rain overlay) after the warp duration", async () => {
            vi.useFakeTimers();
            render(<SpoonEasterEgg />);

            typeSpoonPhrase();
            await act(async () => {
                vi.advanceTimersByTime(400);
            });
            expect(screen.getByTestId("spoon-matrix-rain")).toBeInTheDocument();

            await act(async () => {
                vi.advanceTimersByTime(5600);
            });
            expect(screen.queryByTestId("spoon-matrix-rain")).not.toBeInTheDocument();
            vi.useRealTimers();
        });

        it("tracks the activation exactly once under the easter_egg_hunt category", () => {
            render(<SpoonEasterEgg />);
            typeSpoonPhrase();
            expect(trackWith).toHaveBeenCalledTimes(1);
            expect(trackWith).toHaveBeenCalledWith({
                category: tracking.category.easter_egg_hunt,
                label: "there_is_no_spoon",
                action: tracking.action.easter_egg_spoon,
            });
        });

        it("is case and whitespace insensitive", () => {
            render(<SpoonEasterEgg />);
            "THERE   IS NO   SPOON".split("").forEach((char) => {
                fireEvent.keyDown(document, { key: char });
            });
            expect(trackWith).toHaveBeenCalledTimes(1);
        });
    });

    describe("when the active element is an input", () => {
        it("does not activate the egg", () => {
            render(<SpoonEasterEgg />);
            const input = document.createElement("input");
            document.body.appendChild(input);
            input.focus();

            typeSpoonPhrase();

            expect(trackWith).not.toHaveBeenCalled();
            expect(document.body.classList.contains("glitch-active")).toBe(false);

            document.body.removeChild(input);
        });
    });

    describe("under reduced motion", () => {
        it("skips the glitch-active shake and shows the rain overlay directly", async () => {
            mockUseReducedMotions.mockReturnValue(true);
            vi.useFakeTimers();
            render(<SpoonEasterEgg />);

            typeSpoonPhrase();
            expect(document.body.classList.contains("glitch-active")).toBe(false);
            expect(screen.getByTestId("spoon-matrix-rain")).toBeInTheDocument();
            vi.useRealTimers();
        });

        it("still fires the egg (tracking + rain) even when reduced", () => {
            mockUseReducedMotions.mockReturnValue(true);
            render(<SpoonEasterEgg />);
            typeSpoonPhrase();
            expect(trackWith).toHaveBeenCalledTimes(1);
            expect(screen.getByTestId("spoon-matrix-rain")).toBeInTheDocument();
        });
    });
});
