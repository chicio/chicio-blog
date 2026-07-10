import { describe, expect, it } from "vitest";
import { formatAnalyticsMonth, formatShortAnalyticsMonth } from "./format-month";

describe("formatAnalyticsMonth", () => {
    it("formats a GA yearMonth token into a human-readable month and year", () => {
        expect(formatAnalyticsMonth("202401")).toBe("January 2024");
        expect(formatAnalyticsMonth("201712")).toBe("December 2017");
    });

    it("returns the raw token when it is not a 6-digit yearMonth", () => {
        expect(formatAnalyticsMonth("")).toBe("");
        expect(formatAnalyticsMonth("2024")).toBe("2024");
        expect(formatAnalyticsMonth("2024-01")).toBe("2024-01");
    });

    it("returns the raw token when the month component is out of range", () => {
        expect(formatAnalyticsMonth("202400")).toBe("202400");
        expect(formatAnalyticsMonth("202413")).toBe("202413");
    });
});

describe("formatShortAnalyticsMonth", () => {
    it("formats a GA yearMonth token into a short abbreviated month + 2-digit year", () => {
        expect(formatShortAnalyticsMonth("202211")).toBe("Nov '22");
        expect(formatShortAnalyticsMonth("202401")).toBe("Jan '24");
    });

    it("returns the raw token when it is not a valid 6-digit yearMonth", () => {
        expect(formatShortAnalyticsMonth("2024")).toBe("2024");
        expect(formatShortAnalyticsMonth("202413")).toBe("202413");
    });
});
