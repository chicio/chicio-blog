import { describe, it, expect } from "vitest";
import { SPOON_PHRASE, appendToSpoonPhraseBuffer, matchesSpoonPhrase } from "./spoon-phrase-buffer";

describe("spoon-phrase-buffer", () => {
    describe("appendToSpoonPhraseBuffer", () => {
        it("appends a printable character to an empty buffer", () => {
            expect(appendToSpoonPhraseBuffer("", "t")).toBe("t");
        });

        it("appends a printable character to a non-empty buffer", () => {
            expect(appendToSpoonPhraseBuffer("th", "e")).toBe("the");
        });

        it("appends the space character", () => {
            expect(appendToSpoonPhraseBuffer("there", " ")).toBe("there ");
        });

        it("ignores non-printable keys such as Shift, Enter or Backspace", () => {
            expect(appendToSpoonPhraseBuffer("there", "Shift")).toBe("there");
            expect(appendToSpoonPhraseBuffer("there", "Enter")).toBe("there");
            expect(appendToSpoonPhraseBuffer("there", "Backspace")).toBe("there");
            expect(appendToSpoonPhraseBuffer("there", "ArrowUp")).toBe("there");
        });

        it("caps the buffer length by dropping the oldest characters", () => {
            let buffer = "";

            for (let i = 0; i < 100; i++) {
                buffer = appendToSpoonPhraseBuffer(buffer, "x");
            }

            expect(buffer.length).toBeLessThanOrEqual(40);
        });
    });

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

        it("builds up to a match one character at a time through appendToSpoonPhraseBuffer", () => {
            let buffer = "";

            SPOON_PHRASE.split("").forEach((char, index) => {
                buffer = appendToSpoonPhraseBuffer(buffer, char);
                const isLastChar = index === SPOON_PHRASE.length - 1;

                expect(matchesSpoonPhrase(buffer)).toBe(isLastChar);
            });
        });
    });
});
