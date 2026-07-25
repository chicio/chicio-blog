import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";
import { act } from "@testing-library/react";
import { SpoonEasterEgg } from "./spoon-easter-egg";
import {
    activateSpoonEasterEgg,
    consumePendingSpoonActivation,
    spoonActivationEvent,
} from "@/lib/easter-eggs/spoon-activation";
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

const dispatchActivation = () => {
    window.dispatchEvent(new Event(spoonActivationEvent));
};

describe("SpoonEasterEgg", () => {
    beforeEach(() => {
        mockUseReducedMotions.mockReturnValue(false);
        vi.mocked(trackWith).mockClear();
        document.body.classList.remove("glitch-active");
        consumePendingSpoonActivation();
    });

    describe("before the activation event fires", () => {
        it("renders nothing", () => {
            render(<SpoonEasterEgg />);
            expect(screen.queryByTestId("spoon-matrix-rain")).not.toBeInTheDocument();
        });
    });

    describe("when the activation event fires", () => {
        it("adds the glitch-active class then shows the rain overlay", async () => {
            vi.useFakeTimers();
            render(<SpoonEasterEgg />);

            act(() => {
                dispatchActivation();
            });
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

            act(() => {
                dispatchActivation();
            });
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
            act(() => {
                dispatchActivation();
            });
            expect(trackWith).toHaveBeenCalledTimes(1);
            expect(trackWith).toHaveBeenCalledWith({
                category: tracking.category.easter_egg_hunt,
                label: "there_is_no_spoon",
                action: tracking.action.easter_egg_spoon,
            });
        });

        it("ignores a second activation event that arrives during a warp", () => {
            render(<SpoonEasterEgg />);
            act(() => {
                dispatchActivation();
            });
            act(() => {
                dispatchActivation();
            });
            expect(trackWith).toHaveBeenCalledTimes(1);
        });
    });

    describe("when the phrase is submitted before the egg has mounted", () => {
        it("drains the pending activation and fires the warp on mount", async () => {
            vi.useFakeTimers();
            activateSpoonEasterEgg();

            render(<SpoonEasterEgg />);

            expect(document.body.classList.contains("glitch-active")).toBe(true);
            expect(trackWith).toHaveBeenCalledTimes(1);

            await act(async () => {
                vi.advanceTimersByTime(400);
            });

            expect(screen.getByTestId("spoon-matrix-rain")).toBeInTheDocument();
            vi.useRealTimers();
        });

        it("clears the pending flag so a later remount does not replay it", () => {
            activateSpoonEasterEgg();

            const { unmount } = render(<SpoonEasterEgg />);
            expect(trackWith).toHaveBeenCalledTimes(1);
            unmount();

            vi.mocked(trackWith).mockClear();
            document.body.classList.remove("glitch-active");

            render(<SpoonEasterEgg />);

            expect(trackWith).not.toHaveBeenCalled();
            expect(document.body.classList.contains("glitch-active")).toBe(false);
        });
    });

    describe("when the phrase is submitted while the egg is already mounted", () => {
        it("fires exactly once via activateSpoonEasterEgg", () => {
            render(<SpoonEasterEgg />);

            act(() => {
                activateSpoonEasterEgg();
            });

            expect(trackWith).toHaveBeenCalledTimes(1);
            expect(consumePendingSpoonActivation()).toBe(false);
        });
    });

    describe("under reduced motion", () => {
        it("skips the glitch-active shake and shows the rain overlay directly", async () => {
            mockUseReducedMotions.mockReturnValue(true);
            vi.useFakeTimers();
            render(<SpoonEasterEgg />);

            act(() => {
                dispatchActivation();
            });
            expect(document.body.classList.contains("glitch-active")).toBe(false);
            expect(screen.getByTestId("spoon-matrix-rain")).toBeInTheDocument();
            vi.useRealTimers();
        });

        it("still fires the egg (tracking + rain) even when reduced", () => {
            mockUseReducedMotions.mockReturnValue(true);
            render(<SpoonEasterEgg />);
            act(() => {
                dispatchActivation();
            });
            expect(trackWith).toHaveBeenCalledTimes(1);
            expect(screen.getByTestId("spoon-matrix-rain")).toBeInTheDocument();
        });
    });
});
