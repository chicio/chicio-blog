import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";
import { fireEvent, act } from "@testing-library/react";
import { DejavuEasterEgg } from "./dejavu";
import { closeEasterEgg, getEasterEggOverlaySlug } from "@/lib/easter-eggs/easter-egg-overlay-state";

describe("DejavuEasterEgg", () => {
    beforeEach(() => {
        closeEasterEgg();
        localStorage.clear();
        document.body.classList.remove("glitch-active");
    });

    describe("initial state", () => {
        it("renders children", () => {
            render(
                <DejavuEasterEgg>
                    <span>child content</span>
                </DejavuEasterEgg>,
            );
            expect(screen.getByText("child content")).toBeInTheDocument();
        });

        it("does not open the overlay before 4 clicks", () => {
            render(<DejavuEasterEgg />);
            expect(getEasterEggOverlaySlug()).toBeNull();
        });
    });

    describe("after 4 logo clicks", () => {
        it("adds the glitch-active class immediately", () => {
            vi.useFakeTimers();
            const { container } = render(<DejavuEasterEgg />);
            const wrapper = container.firstChild as HTMLElement;

            for (let i = 0; i < 4; i++) {
                fireEvent.click(wrapper);
            }

            expect(document.body.classList.contains("glitch-active")).toBe(true);
            vi.useRealTimers();
        });

        it("opens the deja-vu egg once the glitch timeout fires", async () => {
            vi.useFakeTimers();
            const { container } = render(<DejavuEasterEgg />);
            const wrapper = container.firstChild as HTMLElement;

            for (let i = 0; i < 4; i++) {
                fireEvent.click(wrapper);
            }

            await act(async () => {
                vi.advanceTimersByTime(400);
            });

            expect(document.body.classList.contains("glitch-active")).toBe(false);
            expect(getEasterEggOverlaySlug()).toBe("deja-vu");
            vi.useRealTimers();
        });

        it("does not trigger again on the 5th click without 4 more clicks", async () => {
            vi.useFakeTimers();
            const { container } = render(<DejavuEasterEgg />);
            const wrapper = container.firstChild as HTMLElement;

            for (let i = 0; i < 4; i++) {
                fireEvent.click(wrapper);
            }
            await act(async () => {
                vi.advanceTimersByTime(400);
            });

            closeEasterEgg();
            fireEvent.click(wrapper);
            expect(getEasterEggOverlaySlug()).toBeNull();
            vi.useRealTimers();
        });

        it("can trigger again after a fresh set of 4 clicks", async () => {
            vi.useFakeTimers();
            const { container } = render(<DejavuEasterEgg />);
            const wrapper = container.firstChild as HTMLElement;

            for (let i = 0; i < 4; i++) {
                fireEvent.click(wrapper);
            }
            await act(async () => {
                vi.advanceTimersByTime(400);
            });
            closeEasterEgg();

            for (let i = 0; i < 4; i++) {
                fireEvent.click(wrapper);
            }
            await act(async () => {
                vi.advanceTimersByTime(400);
            });

            expect(getEasterEggOverlaySlug()).toBe("deja-vu");
            vi.useRealTimers();
        });
    });
});
