import { describe, it, expect } from "vitest";
import { isFightingGenre, isTapSequenceComplete, TAPS_TO_TRIGGER } from "./fighting-genre";

describe("fighting-genre", () => {
    describe("isFightingGenre", () => {
        it("matches the genre as it is written in the frontmatter", () => {
            expect(isFightingGenre("Fighting")).toBe(true);
        });

        it("ignores casing and surrounding whitespace", () => {
            expect(isFightingGenre("fighting")).toBe(true);
            expect(isFightingGenre("  FIGHTING  ")).toBe(true);
        });

        it("does not match any other genre", () => {
            ["Action", "Platformer", "RPG", "Racing", "Sports"].forEach((genre) => {
                expect(isFightingGenre(genre)).toBe(false);
            });
        });

        it("does not match a genre that merely contains the word", () => {
            expect(isFightingGenre("Fighting Adventure")).toBe(false);
        });

        it("handles a game with no genre recorded", () => {
            expect(isFightingGenre(undefined)).toBe(false);
        });
    });

    describe("isTapSequenceComplete", () => {
        it("is not complete before the last tap", () => {
            for (let count = 0; count < TAPS_TO_TRIGGER; count++) {
                expect(isTapSequenceComplete(count)).toBe(false);
            }
        });

        it("is complete on the last tap", () => {
            expect(isTapSequenceComplete(TAPS_TO_TRIGGER)).toBe(true);
        });

        it("stays complete past the last tap", () => {
            expect(isTapSequenceComplete(TAPS_TO_TRIGGER + 1)).toBe(true);
        });
    });
});
