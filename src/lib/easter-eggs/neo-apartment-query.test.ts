import { describe, it, expect } from "vitest";
import { matchesNeoApartmentQuery } from "./neo-apartment-query";

describe("matchesNeoApartmentQuery", () => {
    it("matches the exact apartment number", () => {
        expect(matchesNeoApartmentQuery("101")).toBe(true);
    });

    it("ignores surrounding whitespace", () => {
        expect(matchesNeoApartmentQuery("  101  ")).toBe(true);
    });

    it("does not match a different number", () => {
        expect(matchesNeoApartmentQuery("102")).toBe(false);
    });

    it("does not match a substring occurrence", () => {
        expect(matchesNeoApartmentQuery("1010")).toBe(false);
    });

    it("does not match an empty query", () => {
        expect(matchesNeoApartmentQuery("")).toBe(false);
    });
});
