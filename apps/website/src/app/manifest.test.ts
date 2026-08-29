import { describe, it, expect } from "vitest";
import manifest from "./manifest";

describe("manifest", () => {
    describe("output shape", () => {
        it("returns a manifest object with the expected name", () => {
            const result = manifest();
            expect(result.name).toBe("Fabrizio Duroni");
            expect(result.short_name).toBe("Fabrizio Duroni");
        });

        it("sets dark Matrix theme colors", () => {
            const result = manifest();
            expect(result.background_color).toBe("#001100");
            expect(result.theme_color).toBe("#001100");
        });

        it("has standalone display mode", () => {
            const result = manifest();
            expect(result.display).toBe("standalone");
        });

        it("includes four icons (two sizes × two purposes)", () => {
            const result = manifest();
            expect(result.icons).toHaveLength(4);
        });

        it("includes at least one shortcut for Blog", () => {
            const result = manifest();
            const blogShortcut = result.shortcuts?.find((s) => s.url === "/blog");
            expect(blogShortcut).toBeDefined();
        });

        it("start_url is /", () => {
            const result = manifest();
            expect(result.start_url).toBe("/");
        });

        it("lang is en", () => {
            const result = manifest();
            expect(result.lang).toBe("en");
        });
    });
});
