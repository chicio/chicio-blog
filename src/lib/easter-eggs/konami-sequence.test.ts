import { describe, it, expect } from "vitest";
import { KONAMI_SEQUENCE, appendKonamiKey, matchesKonamiSequence } from "./konami-sequence";

describe("konami-sequence", () => {
    describe("appendKonamiKey", () => {
        it("appends a key to an empty buffer", () => {
            expect(appendKonamiKey([], "ArrowUp")).toEqual(["ArrowUp"]);
        });

        it("appends a key to a non-empty buffer", () => {
            expect(appendKonamiKey(["ArrowUp"], "ArrowDown")).toEqual(["ArrowUp", "ArrowDown"]);
        });

        it("keeps the buffer capped at the sequence length by dropping the oldest key", () => {
            const fullBuffer = KONAMI_SEQUENCE.slice();

            expect(appendKonamiKey(fullBuffer, "x")).toEqual([...KONAMI_SEQUENCE.slice(1), "x"]);
        });

        it("never grows the buffer past the sequence length", () => {
            let buffer: string[] = [];

            for (let i = 0; i < KONAMI_SEQUENCE.length + 5; i++) {
                buffer = appendKonamiKey(buffer, "x");
            }

            expect(buffer.length).toBe(KONAMI_SEQUENCE.length);
        });
    });

    describe("matchesKonamiSequence", () => {
        it("returns false for an empty buffer", () => {
            expect(matchesKonamiSequence([])).toBe(false);
        });

        it("returns false for a buffer shorter than the sequence", () => {
            expect(matchesKonamiSequence(["ArrowUp", "ArrowUp"])).toBe(false);
        });

        it("returns false when the buffer has the right length but wrong keys", () => {
            const wrongBuffer = KONAMI_SEQUENCE.slice().reverse();

            expect(matchesKonamiSequence(wrongBuffer)).toBe(false);
        });

        it("returns true when the buffer exactly matches the sequence", () => {
            expect(matchesKonamiSequence(KONAMI_SEQUENCE)).toBe(true);
        });

        it("builds up to a match one key at a time through appendKonamiKey", () => {
            let buffer: string[] = [];

            KONAMI_SEQUENCE.forEach((key, index) => {
                buffer = appendKonamiKey(buffer, key);
                const isLastKey = index === KONAMI_SEQUENCE.length - 1;

                expect(matchesKonamiSequence(buffer)).toBe(isLastKey);
            });
        });

        it("does not match when a single key in the sequence is wrong", () => {
            const almostRight = [...KONAMI_SEQUENCE.slice(0, -1), "wrong"];

            expect(matchesKonamiSequence(almostRight)).toBe(false);
        });
    });
});
