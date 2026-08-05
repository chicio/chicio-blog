import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";
import { act } from "@testing-library/react";
import { EggSolution } from "./egg-solution";
import { triggerRevealAllSolutions } from "@/lib/content/easter-eggs/reveal-all-signal";
import { tracking } from "@/types/configuration/tracking";

const { trackWithMock } = vi.hoisted(() => ({ trackWithMock: vi.fn() }));

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: trackWithMock }));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("EggSolution", () => {
    describe("reveal", () => {
        it("keeps the solution hidden until the toggle is clicked", () => {
            render(<EggSolution eggId="the_white_rabbit">the answer</EggSolution>);

            expect(screen.queryByText("the answer")).not.toBeInTheDocument();
        });

        it("shows the solution once the toggle is clicked", () => {
            render(<EggSolution eggId="the_white_rabbit">the answer</EggSolution>);

            fireEvent.click(screen.getByRole("button", { name: /reveal/ }));

            expect(screen.getByText("the answer")).toBeInTheDocument();
        });

        it("hides the solution again on a second click", () => {
            render(<EggSolution eggId="the_white_rabbit">the answer</EggSolution>);

            fireEvent.click(screen.getByRole("button", { name: /reveal/ }));
            fireEvent.click(screen.getByRole("button", { name: /hide/ }));

            expect(screen.queryByText("the answer")).not.toBeInTheDocument();
        });

        it("reflects the open state on the toggle for assistive technology", () => {
            render(<EggSolution eggId="the_white_rabbit">the answer</EggSolution>);
            const toggle = screen.getByRole("button", { name: /reveal/ });

            expect(toggle).toHaveAttribute("aria-expanded", "false");

            fireEvent.click(toggle);

            expect(screen.getByRole("button", { name: /hide/ })).toHaveAttribute("aria-expanded", "true");
        });
    });

    describe("tracking", () => {
        it("tracks the reveal with the egg id as label", () => {
            render(<EggSolution eggId="i_know_kung_fu">the answer</EggSolution>);

            fireEvent.click(screen.getByRole("button", { name: /reveal/ }));

            expect(trackWithMock).toHaveBeenCalledWith({
                category: tracking.category.easter_egg_hunt,
                label: "i_know_kung_fu",
                action: tracking.action.easter_egg_hunt_reveal_hint,
            });
        });

        it("does not track when the solution is collapsed again", () => {
            render(<EggSolution eggId="i_know_kung_fu">the answer</EggSolution>);

            fireEvent.click(screen.getByRole("button", { name: /reveal/ }));
            fireEvent.click(screen.getByRole("button", { name: /hide/ }));

            expect(trackWithMock).toHaveBeenCalledTimes(1);
        });
    });

    describe("reveal all solutions", () => {
        it("expands the solution when the reveal-all signal fires", () => {
            render(<EggSolution eggId="the_white_rabbit">the answer</EggSolution>);

            act(() => {
                triggerRevealAllSolutions();
            });

            expect(screen.getByText("the answer")).toBeInTheDocument();
        });

        it("does not fire the reveal-hint tracking action", () => {
            render(<EggSolution eggId="the_white_rabbit">the answer</EggSolution>);

            act(() => {
                triggerRevealAllSolutions();
            });

            expect(trackWithMock).not.toHaveBeenCalled();
        });
    });
});
