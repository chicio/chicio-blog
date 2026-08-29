import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    readVideogamesNavigationOrigin,
    writeVideogamesNavigationOrigin,
    videogamesNavigationOriginChangeEvent,
} from "./videogames-navigation-origin";

const STORAGE_KEY = "fabrizioduroni_videogames_navigation_origin";

describe("videogames-navigation-origin", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    describe("readVideogamesNavigationOrigin", () => {
        it("returns 'all-games' when that value is stored", () => {
            sessionStorage.setItem(STORAGE_KEY, "all-games");
            expect(readVideogamesNavigationOrigin()).toBe("all-games");
        });

        it("returns 'console' when that value is stored", () => {
            sessionStorage.setItem(STORAGE_KEY, "console");
            expect(readVideogamesNavigationOrigin()).toBe("console");
        });

        it("returns null when nothing is stored", () => {
            expect(readVideogamesNavigationOrigin()).toBeNull();
        });

        it("returns null for an unrecognised stored value", () => {
            sessionStorage.setItem(STORAGE_KEY, "unknown");
            expect(readVideogamesNavigationOrigin()).toBeNull();
        });
    });

    describe("writeVideogamesNavigationOrigin", () => {
        it("persists 'all-games' to sessionStorage", () => {
            writeVideogamesNavigationOrigin("all-games");
            expect(sessionStorage.getItem(STORAGE_KEY)).toBe("all-games");
        });

        it("persists 'console' to sessionStorage", () => {
            writeVideogamesNavigationOrigin("console");
            expect(sessionStorage.getItem(STORAGE_KEY)).toBe("console");
        });

        it("dispatches the videogames-navigation-origin-change event", () => {
            const listener = vi.fn();
            window.addEventListener(videogamesNavigationOriginChangeEvent, listener);
            writeVideogamesNavigationOrigin("all-games");
            window.removeEventListener(videogamesNavigationOriginChangeEvent, listener);
            expect(listener).toHaveBeenCalledOnce();
        });

        it("round-trips: write 'console' then read it back", () => {
            writeVideogamesNavigationOrigin("console");
            expect(readVideogamesNavigationOrigin()).toBe("console");
        });
    });
});
