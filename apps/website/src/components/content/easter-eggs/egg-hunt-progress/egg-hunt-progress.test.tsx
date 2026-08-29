import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";
import { act } from "@testing-library/react";
import { EggHuntProgress } from "./egg-hunt-progress";
import { markEasterEggFound, readFoundEasterEggs } from "@/lib/easter-eggs/easter-egg-found";
import { revealAllSolutionsEvent } from "@/lib/content/easter-eggs/reveal-all-signal";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

describe("EggHuntProgress", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.mocked(trackWith).mockClear();
    });

    describe("count", () => {
        it("shows 0 / 6 when nothing has been found", () => {
            render(<EggHuntProgress />);
            expect(screen.getByText(/0 \/ 6 easter eggs found/)).toBeInTheDocument();
        });

        it("reflects the number of eggs already found", () => {
            markEasterEggFound("the-one");
            markEasterEggFound("dodge-this");
            render(<EggHuntProgress />);
            expect(screen.getByText(/2 \/ 6 easter eggs found/)).toBeInTheDocument();
        });

        it("updates live when an egg is found while mounted", () => {
            render(<EggHuntProgress />);
            expect(screen.getByText(/0 \/ 6 easter eggs found/)).toBeInTheDocument();

            act(() => {
                markEasterEggFound("the-choice");
            });

            expect(screen.getByText(/1 \/ 6 easter eggs found/)).toBeInTheDocument();
        });
    });

    describe("progress bar percentage", () => {
        it("shows 0% when nothing is found", () => {
            render(<EggHuntProgress />);
            expect(screen.getByText(/0%/)).toBeInTheDocument();
        });

        it("shows a rounded percentage for partial progress", () => {
            markEasterEggFound("the-one");
            render(<EggHuntProgress />);
            expect(screen.getByText(/17%/)).toBeInTheDocument();
        });
    });

    describe("reset hunt", () => {
        it("clears every found egg", () => {
            markEasterEggFound("the-one");
            render(<EggHuntProgress />);
            fireEvent.click(screen.getByRole("button", { name: /reset hunt/i }));
            expect(readFoundEasterEggs()).toEqual([]);
        });

        it("fires the reset tracking action", () => {
            render(<EggHuntProgress />);
            fireEvent.click(screen.getByRole("button", { name: /reset hunt/i }));
            expect(trackWith).toHaveBeenCalledWith({
                category: tracking.category.easter_egg_hunt,
                label: tracking.label.body,
                action: tracking.action.easter_egg_hunt_reset,
            });
        });
    });

    describe("reveal all solutions", () => {
        it("dispatches the reveal-all signal", () => {
            const listener = vi.fn();
            window.addEventListener(revealAllSolutionsEvent, listener);
            render(<EggHuntProgress />);
            fireEvent.click(screen.getByRole("button", { name: /reveal all solutions/i }));
            window.removeEventListener(revealAllSolutionsEvent, listener);
            expect(listener).toHaveBeenCalledOnce();
        });

        it("does not mark anything as found", () => {
            render(<EggHuntProgress />);
            fireEvent.click(screen.getByRole("button", { name: /reveal all solutions/i }));
            expect(readFoundEasterEggs()).toEqual([]);
        });

        it("fires the reveal-all tracking action", () => {
            render(<EggHuntProgress />);
            fireEvent.click(screen.getByRole("button", { name: /reveal all solutions/i }));
            expect(trackWith).toHaveBeenCalledWith({
                category: tracking.category.easter_egg_hunt,
                label: tracking.label.body,
                action: tracking.action.easter_egg_hunt_reveal_all,
            });
        });
    });
});
