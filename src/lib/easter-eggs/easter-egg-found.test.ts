import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    easterEggFoundChangeEvent,
    isEasterEggFound,
    markEasterEggFound,
    readFoundEasterEggs,
    resetFoundEasterEggs,
} from "./easter-egg-found";

const STORAGE_KEY = "fabrizioduroni_chicio-easter-egg-hunt";

describe("easter-egg-found", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("readFoundEasterEggs", () => {
        it("returns an empty array when nothing has been stored", () => {
            expect(readFoundEasterEggs()).toEqual([]);
        });

        it("returns the previously stored slugs", () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(["the-one", "dodge-this"]));
            expect(readFoundEasterEggs()).toEqual(["the-one", "dodge-this"]);
        });

        it("filters out slugs that no longer exist in the catalog", () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(["the-one", "a-renamed-or-deleted-egg"]));
            expect(readFoundEasterEggs()).toEqual(["the-one"]);
        });

        it("returns an empty array for malformed JSON", () => {
            localStorage.setItem(STORAGE_KEY, "{not json");
            expect(readFoundEasterEggs()).toEqual([]);
        });

        it("returns an empty array when the stored value is not an array", () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: "an array" }));
            expect(readFoundEasterEggs()).toEqual([]);
        });
    });

    describe("isEasterEggFound", () => {
        it("returns false for a slug that has not been found", () => {
            expect(isEasterEggFound("the-one")).toBe(false);
        });

        it("returns true for a slug that has been found", () => {
            markEasterEggFound("the-one");
            expect(isEasterEggFound("the-one")).toBe(true);
        });
    });

    describe("markEasterEggFound", () => {
        it("adds the slug to the stored found list", () => {
            markEasterEggFound("deja-vu");
            expect(readFoundEasterEggs()).toEqual(["deja-vu"]);
        });

        it("accumulates multiple distinct slugs", () => {
            markEasterEggFound("deja-vu");
            markEasterEggFound("the-one");
            expect(readFoundEasterEggs().sort()).toEqual(["deja-vu", "the-one"]);
        });

        it("does not duplicate a slug marked found twice", () => {
            markEasterEggFound("deja-vu");
            markEasterEggFound("deja-vu");
            expect(readFoundEasterEggs()).toEqual(["deja-vu"]);
        });

        it("dispatches the found-change event when a new slug is recorded", () => {
            const listener = vi.fn();
            window.addEventListener(easterEggFoundChangeEvent, listener);
            markEasterEggFound("deja-vu");
            window.removeEventListener(easterEggFoundChangeEvent, listener);
            expect(listener).toHaveBeenCalledOnce();
        });

        it("does not dispatch the found-change event for an already-found slug", () => {
            markEasterEggFound("deja-vu");
            const listener = vi.fn();
            window.addEventListener(easterEggFoundChangeEvent, listener);
            markEasterEggFound("deja-vu");
            window.removeEventListener(easterEggFoundChangeEvent, listener);
            expect(listener).not.toHaveBeenCalled();
        });
    });

    describe("resetFoundEasterEggs", () => {
        it("clears every previously found slug", () => {
            markEasterEggFound("deja-vu");
            markEasterEggFound("the-one");
            resetFoundEasterEggs();
            expect(readFoundEasterEggs()).toEqual([]);
        });

        it("dispatches the found-change event", () => {
            const listener = vi.fn();
            window.addEventListener(easterEggFoundChangeEvent, listener);
            resetFoundEasterEggs();
            window.removeEventListener(easterEggFoundChangeEvent, listener);
            expect(listener).toHaveBeenCalledOnce();
        });
    });
});
