import { describe, it, expect } from "vitest";
import { HEADER_CLICKS_TO_TRIGGER, isHeaderClickSequenceComplete } from "./header-click-sequence";

describe("isHeaderClickSequenceComplete", () => {
    it("is not complete below the trigger count", () => {
        expect(isHeaderClickSequenceComplete(HEADER_CLICKS_TO_TRIGGER - 1)).toBe(false);
    });

    it("is complete exactly at the trigger count", () => {
        expect(isHeaderClickSequenceComplete(HEADER_CLICKS_TO_TRIGGER)).toBe(true);
    });

    it("is complete above the trigger count", () => {
        expect(isHeaderClickSequenceComplete(HEADER_CLICKS_TO_TRIGGER + 3)).toBe(true);
    });

    it("is not complete at zero clicks", () => {
        expect(isHeaderClickSequenceComplete(0)).toBe(false);
    });
});
