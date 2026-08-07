import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";
import { fireEvent } from "@testing-library/react";
import { DejavuEasterEgg } from "./dejavu";
import { closeEasterEgg, getEasterEggOverlaySlug } from "@/lib/easter-eggs/easter-egg-overlay-state";

const clickHeader = (wrapper: HTMLElement, times: number) => {
    for (let i = 0; i < times; i++) {
        fireEvent.click(wrapper);
    }
};

describe("DejavuEasterEgg", () => {
    beforeEach(() => {
        closeEasterEgg();
        localStorage.clear();
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
            const { container } = render(<DejavuEasterEgg />);

            clickHeader(container.firstChild as HTMLElement, 3);

            expect(getEasterEggOverlaySlug()).toBeNull();
        });
    });

    describe("after 4 logo clicks", () => {
        /**
         * No timers are advanced anywhere in here on purpose. The trigger used to shake the page for
         * 400ms before opening; if that delay ever comes back, these assertions fail rather than
         * quietly passing after a tick.
         */
        it("opens the deja-vu egg on the fourth click, with no delay in between", () => {
            const { container } = render(<DejavuEasterEgg />);

            clickHeader(container.firstChild as HTMLElement, 4);

            expect(getEasterEggOverlaySlug()).toBe("deja-vu");
        });

        it("does not trigger again on the 5th click without 4 more clicks", () => {
            const { container } = render(<DejavuEasterEgg />);
            const wrapper = container.firstChild as HTMLElement;

            clickHeader(wrapper, 4);
            closeEasterEgg();
            clickHeader(wrapper, 1);

            expect(getEasterEggOverlaySlug()).toBeNull();
        });

        it("can trigger again after a fresh set of 4 clicks", () => {
            const { container } = render(<DejavuEasterEgg />);
            const wrapper = container.firstChild as HTMLElement;

            clickHeader(wrapper, 4);
            closeEasterEgg();
            clickHeader(wrapper, 4);

            expect(getEasterEggOverlaySlug()).toBe("deja-vu");
        });
    });
});
