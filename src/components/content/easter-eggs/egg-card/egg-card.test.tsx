import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";
import { EggCard } from "./egg-card";
import { markEasterEggFound } from "@/lib/easter-eggs/easter-egg-found";
import { closeEasterEgg, getEasterEggOverlaySlug } from "@/lib/easter-eggs/easter-egg-overlay-state";

describe("EggCard", () => {
    beforeEach(() => {
        localStorage.clear();
        closeEasterEgg();
    });

    describe("hidden state", () => {
        it("renders the title and children", () => {
            render(
                <EggCard title="The One" slug="the-one">
                    <p>a cryptic hint</p>
                </EggCard>,
            );
            expect(screen.getByText(/The One/)).toBeInTheDocument();
            expect(screen.getByText("a cryptic hint")).toBeInTheDocument();
        });

        it("shows the hidden badge when the egg has not been found", () => {
            render(
                <EggCard title="The One" slug="the-one">
                    <p>a cryptic hint</p>
                </EggCard>,
            );
            expect(screen.getByText("hidden")).toBeInTheDocument();
        });

        it("does not show the replay button", () => {
            render(
                <EggCard title="The One" slug="the-one">
                    <p>a cryptic hint</p>
                </EggCard>,
            );
            expect(screen.queryByRole("button", { name: /replay/i })).not.toBeInTheDocument();
        });
    });

    describe("found state", () => {
        it("shows the found badge once the egg has been found", () => {
            markEasterEggFound("the-one");
            render(
                <EggCard title="The One" slug="the-one">
                    <p>a cryptic hint</p>
                </EggCard>,
            );
            expect(screen.getByText("found")).toBeInTheDocument();
            expect(screen.queryByText("hidden")).not.toBeInTheDocument();
        });

        it("gives the card an accent border when found", () => {
            markEasterEggFound("the-one");
            const { container } = render(
                <EggCard title="The One" slug="the-one">
                    <p>a cryptic hint</p>
                </EggCard>,
            );
            expect(container.firstChild).toHaveClass("border-accent");
        });

        it("shows a replay button that reopens the overlay for this slug", () => {
            markEasterEggFound("the-one");
            render(
                <EggCard title="The One" slug="the-one">
                    <p>a cryptic hint</p>
                </EggCard>,
            );
            fireEvent.click(screen.getByRole("button", { name: /replay/i }));
            expect(getEasterEggOverlaySlug()).toBe("the-one");
        });
    });
});
