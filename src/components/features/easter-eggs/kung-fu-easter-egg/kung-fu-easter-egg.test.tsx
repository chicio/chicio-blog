import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import type { PropsWithChildren } from "react";
import { render, screen, act } from "@/test-utils";
import { fireEvent } from "@testing-library/react";
import { KungFuEasterEgg } from "./kung-fu-easter-egg";
import { KONAMI_SEQUENCE } from "@/lib/easter-eggs/konami-sequence";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";

const playMock = vi.fn().mockResolvedValue(undefined);
const loadMock = vi.fn();

beforeAll(() => {
    vi.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(playMock);
    vi.spyOn(window.HTMLMediaElement.prototype, "load").mockImplementation(loadMock);
    Object.defineProperty(window.HTMLMediaElement.prototype, "currentTime", {
        configurable: true,
        get() {
            return 0;
        },
        set() {},
    });
});

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

vi.mock("@/components/design-system/atoms/effects/overlay", () => ({
    Overlay: ({ children, onClick }: PropsWithChildren<{ onClick?: () => void }>) => (
        <div data-testid="overlay" onClick={onClick}>
            {children}
        </div>
    ),
}));

vi.mock("@/components/features/easter-eggs/center-container", () => ({
    CenterContainer: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

const typeKonamiSequence = () => {
    KONAMI_SEQUENCE.forEach((key) => {
        fireEvent.keyDown(document, { key });
    });
};

const tapHotspot = (times: number) => {
    const hotspot = screen.getByTestId("kung-fu-tap-hotspot");
    for (let i = 0; i < times; i++) {
        fireEvent.click(hotspot);
    }
};

describe("KungFuEasterEgg", () => {
    beforeEach(() => {
        vi.mocked(trackWith).mockClear();
        playMock.mockClear();
        loadMock.mockClear();
    });

    describe("before either trigger fires", () => {
        it("renders the hidden tap hotspot but no overlay", () => {
            render(<KungFuEasterEgg />);
            expect(screen.getByTestId("kung-fu-tap-hotspot")).toBeInTheDocument();
            expect(screen.getByTestId("kung-fu-tap-hotspot")).toHaveAttribute("aria-hidden", "true");
            expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
        });

        it("does not activate on an unrelated key sequence", () => {
            render(<KungFuEasterEgg />);
            fireEvent.keyDown(document, { key: "ArrowUp" });
            fireEvent.keyDown(document, { key: "ArrowLeft" });
            expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
        });
    });

    describe("the corner tap hotspot", () => {
        it("fires the reveal after 5 quick taps", () => {
            const { container } = render(<KungFuEasterEgg />);
            tapHotspot(5);
            expect(screen.getByTestId("overlay")).toBeInTheDocument();
            expect(container.querySelector("video")).toBeInTheDocument();
        });

        it("does not fire the reveal after fewer than 5 taps", () => {
            render(<KungFuEasterEgg />);
            tapHotspot(4);
            expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
        });

        it("restarts the tap count once the reset window elapses", () => {
            vi.useFakeTimers();
            render(<KungFuEasterEgg />);

            tapHotspot(3);
            act(() => {
                vi.advanceTimersByTime(1500);
            });
            tapHotspot(2);

            expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
            vi.useRealTimers();
        });

        it("tracks the activation exactly once under the easter_egg_hunt category", () => {
            render(<KungFuEasterEgg />);
            tapHotspot(5);
            expect(trackWith).toHaveBeenCalledTimes(1);
            expect(trackWith).toHaveBeenCalledWith({
                category: tracking.category.easter_egg_hunt,
                label: "i_know_kung_fu",
                action: tracking.action.easter_egg_kung_fu,
            });
        });

        it("does not re-fire on further taps once already active", () => {
            render(<KungFuEasterEgg />);
            tapHotspot(5);
            tapHotspot(5);
            expect(trackWith).toHaveBeenCalledTimes(1);
        });
    });

    describe("cross-trigger guard", () => {
        it("fires only once when the Konami code completes while taps are already active", () => {
            render(<KungFuEasterEgg />);
            tapHotspot(5);
            typeKonamiSequence();
            expect(trackWith).toHaveBeenCalledTimes(1);
        });
    });

    describe("after the Konami code is typed", () => {
        it("shows the overlay with an autoplaying video pointed at the kung fu clip", () => {
            const { container } = render(<KungFuEasterEgg />);
            typeKonamiSequence();
            expect(screen.getByTestId("overlay")).toBeInTheDocument();

            const video = container.querySelector("video");
            expect(video).toBeInTheDocument();
            expect(video?.querySelector("source")).toHaveAttribute("src", "/media/video/i-know-kung-fu.mp4");
            expect(video).toHaveAttribute("poster", "/media/video/i-know-kung-fu-poster.jpg");
            expect(video).toHaveAttribute("autoplay");
            expect(video).not.toHaveAttribute("muted");
            expect(video).toHaveAttribute("aria-label", "I know kung fu — Matrix construct loading");
        });

        it("tracks the activation exactly once under the easter_egg_hunt category", () => {
            render(<KungFuEasterEgg />);
            typeKonamiSequence();
            expect(trackWith).toHaveBeenCalledTimes(1);
            expect(trackWith).toHaveBeenCalledWith({
                category: tracking.category.easter_egg_hunt,
                label: "i_know_kung_fu",
                action: tracking.action.easter_egg_kung_fu,
            });
        });

        it("dismisses the overlay when clicked", () => {
            render(<KungFuEasterEgg />);
            typeKonamiSequence();
            fireEvent.click(screen.getByTestId("overlay"));
            expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
        });

        it("dismisses the overlay on Escape", () => {
            render(<KungFuEasterEgg />);
            typeKonamiSequence();
            fireEvent.keyDown(document, { key: "Escape" });
            expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
        });
    });

    describe("the replay pill", () => {
        it("stays hidden until the video finishes", () => {
            render(<KungFuEasterEgg />);
            typeKonamiSequence();

            const wrapper = screen.getByText("I Know Kung Fu").closest("button")?.parentElement;
            expect(wrapper).toHaveStyle({ visibility: "hidden" });
        });

        it("becomes visible once the video's onEnded fires", () => {
            const { container } = render(<KungFuEasterEgg />);
            typeKonamiSequence();

            const video = container.querySelector("video");
            if (video) {
                fireEvent.ended(video);
            }

            const pill = screen.getByRole("button", { name: "I Know Kung Fu" });
            expect(pill.parentElement).toHaveStyle({ visibility: "visible" });
        });

        it("restarts the video and calls play() when clicked, without dismissing the overlay", () => {
            const { container } = render(<KungFuEasterEgg />);
            typeKonamiSequence();

            const video = container.querySelector("video");
            if (video) {
                fireEvent.ended(video);
            }
            playMock.mockClear();

            fireEvent.click(screen.getByRole("button", { name: "I Know Kung Fu" }));

            expect(playMock).toHaveBeenCalledTimes(1);
            expect(screen.getByTestId("overlay")).toBeInTheDocument();
        });
    });
});
