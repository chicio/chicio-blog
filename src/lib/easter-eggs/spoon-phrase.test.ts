import { describe, it, expect } from "vitest";
import { SPOON_PHRASE, matchesSpoonPhrase } from "./spoon-phrase";

describe("spoon-phrase", () => {
    describe("matchesSpoonPhrase", () => {
        it("returns false for an empty buffer", () => {
            expect(matchesSpoonPhrase("")).toBe(false);
        });

        it("returns true for an exact lowercase match", () => {
            expect(matchesSpoonPhrase(SPOON_PHRASE)).toBe(true);
        });

        it("is case insensitive", () => {
            expect(matchesSpoonPhrase("THERE IS NO SPOON")).toBe(true);
            expect(matchesSpoonPhrase("There Is No Spoon")).toBe(true);
        });

        it("is whitespace insensitive, matching extra or collapsed spaces", () => {
            expect(matchesSpoonPhrase("there  is   no spoon")).toBe(true);
            expect(matchesSpoonPhrase("thereisnospoon")).toBe(true);
        });

        it("matches when the phrase is a suffix of a longer buffer", () => {
            expect(matchesSpoonPhrase("i know there is no spoon")).toBe(true);
        });

        it("returns false when the buffer does not contain the phrase as a suffix", () => {
            expect(matchesSpoonPhrase("there is no spoonx")).toBe(false);
            expect(matchesSpoonPhrase("there is no fork")).toBe(false);
        });
    });
});
