import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";
import { act } from "@testing-library/react";
import { EggSolution } from "./egg-solution";
import { triggerRevealAllSolutions } from "@/lib/content/easter-eggs/reveal-all-signal";
import { markEasterEggFound } from "@/lib/easter-eggs/easter-egg-found";
import { closeEasterEgg, getEasterEggOverlaySlug } from "@/lib/easter-eggs/easter-egg-overlay-state";
import { tracking } from "@/types/configuration/tracking";

const { trackWithMock } = vi.hoisted(() => ({ trackWithMock: vi.fn() }));

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: trackWithMock }));

beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    closeEasterEgg();
});

describe("EggSolution", () => {
    describe("replay", () => {
        it("does not offer replay for an egg that has not been found", () => {
            render(<EggSolution slug="the-one">the answer</EggSolution>);

            expect(screen.queryByRole("button", { name: /replay/i })).not.toBeInTheDocument();
        });

        it("offers replay once the egg has been found, and reopens the overlay for that slug", () => {
            markEasterEggFound("the-one");
            render(<EggSolution slug="the-one">the answer</EggSolution>);

            fireEvent.click(screen.getByRole("button", { name: /replay/i }));

            expect(getEasterEggOverlaySlug()).toBe("the-one");
        });

        it("puts replay on the same row as the reveal toggle", () => {
            markEasterEggFound("the-one");
            render(<EggSolution slug="the-one">the answer</EggSolution>);

            const reveal = screen.getByRole("button", { name: /reveal/i });
            const replay = screen.getByRole("button", { name: /replay/i });

            expect(reveal.parentElement).toBe(replay.parentElement);
        });
    });

    describe("reveal", () => {
        it("keeps the solution hidden until the toggle is clicked", () => {
            render(<EggSolution slug="the-white-rabbit">the answer</EggSolution>);

            expect(screen.queryByText("the answer")).not.toBeInTheDocument();
        });

        it("shows the solution once the toggle is clicked", () => {
            render(<EggSolution slug="the-white-rabbit">the answer</EggSolution>);

            fireEvent.click(screen.getByRole("button", { name: /reveal/i }));

            expect(screen.getByText("the answer")).toBeInTheDocument();
        });

        it("hides the solution again on a second click", () => {
            render(<EggSolution slug="the-white-rabbit">the answer</EggSolution>);

            fireEvent.click(screen.getByRole("button", { name: /reveal/i }));
            fireEvent.click(screen.getByRole("button", { name: /hide/i }));

            expect(screen.queryByText("the answer")).not.toBeInTheDocument();
        });

        it("reflects the open state on the toggle for assistive technology", () => {
            render(<EggSolution slug="the-white-rabbit">the answer</EggSolution>);
            const toggle = screen.getByRole("button", { name: /reveal/i });

            expect(toggle).toHaveAttribute("aria-expanded", "false");

            fireEvent.click(toggle);

            expect(screen.getByRole("button", { name: /hide/i })).toHaveAttribute("aria-expanded", "true");
        });
    });

    describe("tracking", () => {
        it("tracks the reveal with the egg id as label", () => {
            render(<EggSolution slug="i-know-kung-fu">the answer</EggSolution>);

            fireEvent.click(screen.getByRole("button", { name: /reveal/i }));

            expect(trackWithMock).toHaveBeenCalledWith({
                category: tracking.category.easter_egg_hunt,
                label: "i_know_kung_fu",
                action: tracking.action.easter_egg_hunt_reveal_hint,
            });
        });

        it("does not track when the solution is collapsed again", () => {
            render(<EggSolution slug="i-know-kung-fu">the answer</EggSolution>);

            fireEvent.click(screen.getByRole("button", { name: /reveal/i }));
            fireEvent.click(screen.getByRole("button", { name: /hide/i }));

            expect(trackWithMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("reveal all solutions", () => {
        it("expands the solution when the reveal-all signal fires", () => {
            render(<EggSolution slug="the-white-rabbit">the answer</EggSolution>);

            act(() => {
                triggerRevealAllSolutions();
            });

            expect(screen.getByText("the answer")).toBeInTheDocument();
        });

        it("does not fire the reveal-hint tracking action", () => {
            render(<EggSolution slug="the-white-rabbit">the answer</EggSolution>);

            act(() => {
                triggerRevealAllSolutions();
            });

            expect(trackWithMock).not.toHaveBeenCalled();
        });
    });
});
