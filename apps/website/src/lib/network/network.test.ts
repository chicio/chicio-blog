import { describe, it, expect } from "vitest";
import { getClientIp } from "./network";

describe("getClientIp", () => {
    describe("x-forwarded-for header present", () => {
        it("returns the first IP in a single-value header", () => {
            const headers = new Headers({ "x-forwarded-for": "1.2.3.4" });
            expect(getClientIp(headers)).toBe("1.2.3.4");
        });

        it("returns the first IP from a comma-separated chain", () => {
            const headers = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8, 9.10.11.12" });
            expect(getClientIp(headers)).toBe("1.2.3.4");
        });

        it("trims whitespace from the first IP", () => {
            const headers = new Headers({ "x-forwarded-for": "  1.2.3.4  , 5.6.7.8" });
            expect(getClientIp(headers)).toBe("1.2.3.4");
        });
    });

    describe("x-forwarded-for header absent", () => {
        it("returns 'unknown' when header is missing", () => {
            const headers = new Headers();
            expect(getClientIp(headers)).toBe("unknown");
        });
    });
});
