import { describe, it, expect } from "vitest";
import { shouldIgnoreKeystroke } from "./input-focus-guard";

describe("input-focus-guard", () => {
    describe("shouldIgnoreKeystroke", () => {
        it("returns false when there is no active element", () => {
            expect(shouldIgnoreKeystroke(null)).toBe(false);
            expect(shouldIgnoreKeystroke(undefined)).toBe(false);
        });

        it("returns false for a plain body element", () => {
            expect(shouldIgnoreKeystroke({ tagName: "BODY", isContentEditable: false })).toBe(false);
        });

        it("returns false for a non-interactive element such as a div", () => {
            expect(shouldIgnoreKeystroke({ tagName: "DIV", isContentEditable: false })).toBe(false);
        });

        it("returns true for an input element", () => {
            expect(shouldIgnoreKeystroke({ tagName: "INPUT", isContentEditable: false })).toBe(true);
        });

        it("returns true for a textarea element", () => {
            expect(shouldIgnoreKeystroke({ tagName: "TEXTAREA", isContentEditable: false })).toBe(true);
        });

        it("returns true for a select element", () => {
            expect(shouldIgnoreKeystroke({ tagName: "SELECT", isContentEditable: false })).toBe(true);
        });

        it("is case insensitive on tagName", () => {
            expect(shouldIgnoreKeystroke({ tagName: "input", isContentEditable: false })).toBe(true);
        });

        it("returns true for a contenteditable element regardless of tagName", () => {
            expect(shouldIgnoreKeystroke({ tagName: "DIV", isContentEditable: true })).toBe(true);
        });
    });
});
