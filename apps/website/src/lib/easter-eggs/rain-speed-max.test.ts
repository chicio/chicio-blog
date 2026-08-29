import { describe, it, expect } from "vitest";
import { isRainSpeedAtMax } from "./rain-speed-max";

describe("isRainSpeedAtMax", () => {
    it("returns false below the maximum", () => {
        expect(isRainSpeedAtMax(10, 30)).toBe(false);
    });

    it("returns true exactly at the maximum", () => {
        expect(isRainSpeedAtMax(30, 30)).toBe(true);
    });

    it("returns true above the maximum", () => {
        expect(isRainSpeedAtMax(35, 30)).toBe(true);
    });
});
