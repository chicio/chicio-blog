import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@/test-utils";
import { FightingGameTrigger } from "./fighting-game-trigger";
import { closeEasterEgg, getEasterEggOverlaySlug } from "@/lib/easter-eggs/easter-egg-overlay-state";
import { TAPS_TO_TRIGGER, TAP_RESET_WINDOW_MS } from "@/lib/easter-eggs/fighting-genre";

const renderTrigger = (genre: string | undefined) =>
    render(
        <FightingGameTrigger genre={genre}>
            <span>Genre: {genre}</span>
        </FightingGameTrigger>,
    );

const tap = (times: number) => {
    const target = screen.getByTestId("fighting-game-trigger");
    for (let i = 0; i < times; i++) {
        fireEvent.click(target);
    }
};

describe("FightingGameTrigger", () => {
    beforeEach(() => {
        closeEasterEgg();
        localStorage.clear();
    });

    describe("on a fighting game", () => {
        it("opens the kung fu egg on the fifth tap", () => {
            renderTrigger("Fighting");

            tap(TAPS_TO_TRIGGER);

            expect(getEasterEggOverlaySlug()).toBe("i-know-kung-fu");
        });

        it("does not open before the fifth tap", () => {
            renderTrigger("Fighting");

            tap(TAPS_TO_TRIGGER - 1);

            expect(getEasterEggOverlaySlug()).toBeNull();
        });

        it("still renders the pill it wraps", () => {
            renderTrigger("Fighting");

            expect(screen.getByText(/Genre: Fighting/)).toBeInTheDocument();
        });

        it("shows a pointer cursor, the only hint that the pill does anything", () => {
            renderTrigger("Fighting");

            expect(screen.getByTestId("fighting-game-trigger")).toHaveClass("cursor-pointer");
        });
    });

    describe("on every other genre", () => {
        it("does not arm itself, so tapping the pill does nothing", () => {
            renderTrigger("Racing");

            expect(screen.queryByTestId("fighting-game-trigger")).not.toBeInTheDocument();
            expect(getEasterEggOverlaySlug()).toBeNull();
        });

        it("renders the pill untouched, with no wrapper around it", () => {
            const { container } = renderTrigger("RPG");

            expect(screen.getByText(/Genre: RPG/)).toBeInTheDocument();
            expect(container.querySelector("div")).toBeNull();
        });
    });

    describe("tap window", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("forgets a partial run once the window lapses, so stray clicks never accumulate", () => {
            renderTrigger("Fighting");

            tap(TAPS_TO_TRIGGER - 1);
            vi.advanceTimersByTime(TAP_RESET_WINDOW_MS + 1);
            tap(1);

            expect(getEasterEggOverlaySlug()).toBeNull();
        });
    });
});
