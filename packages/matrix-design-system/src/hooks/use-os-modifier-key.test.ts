import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useOsModifierKey } from "./use-os-modifier-key";

describe("useOsModifierKey", () => {
    describe("return type", () => {
        it("returns meta, ctrl, or null", () => {
            const { result } = renderHook(() => useOsModifierKey());
            expect(["meta", "ctrl", null]).toContain(result.current);
        });
    });

    describe("in jsdom (no Mac/iPhone UA)", () => {
        it("returns ctrl because jsdom UA does not contain Mac/iPhone/iPad/iPod", () => {
            const { result } = renderHook(() => useOsModifierKey());
            expect(result.current).toBe("ctrl");
        });
    });
});
