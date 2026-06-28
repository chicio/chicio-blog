import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    readVideogamesView,
    writeVideogamesView,
    videogamesViewChangeEvent,
} from "./videogames-view";

const STORAGE_KEY = "fabrizioduroni_videogames_view";

describe("videogames-view", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("readVideogamesView", () => {
        it("returns 'consoles' when that value is stored", () => {
            localStorage.setItem(STORAGE_KEY, "consoles");
            expect(readVideogamesView()).toBe("consoles");
        });

        it("returns 'games' when that value is stored", () => {
            localStorage.setItem(STORAGE_KEY, "games");
            expect(readVideogamesView()).toBe("games");
        });

        it("returns 'consoles' as the default when nothing is stored", () => {
            expect(readVideogamesView()).toBe("consoles");
        });

        it("returns 'consoles' for an unrecognised stored value", () => {
            localStorage.setItem(STORAGE_KEY, "unknown");
            expect(readVideogamesView()).toBe("consoles");
        });
    });

    describe("writeVideogamesView", () => {
        it("persists the view to localStorage", () => {
            writeVideogamesView("games");
            expect(localStorage.getItem(STORAGE_KEY)).toBe("games");
        });

        it("dispatches the videogames-view-change event", () => {
            const listener = vi.fn();
            window.addEventListener(videogamesViewChangeEvent, listener);
            writeVideogamesView("games");
            window.removeEventListener(videogamesViewChangeEvent, listener);
            expect(listener).toHaveBeenCalledOnce();
        });

        it("round-trips: write 'games' then read it back", () => {
            writeVideogamesView("games");
            expect(readVideogamesView()).toBe("games");
        });

        it("round-trips: write 'consoles' then read it back", () => {
            writeVideogamesView("consoles");
            expect(readVideogamesView()).toBe("consoles");
        });
    });
});
