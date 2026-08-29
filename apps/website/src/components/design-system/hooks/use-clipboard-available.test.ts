import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useClipboardAvailable } from "./use-clipboard-available";

describe("useClipboardAvailable", () => {
    describe("when navigator.clipboard is present", () => {
        beforeEach(() => {
            Object.defineProperty(navigator, "clipboard", {
                value: { writeText: vi.fn() },
                configurable: true,
                writable: true,
            });
        });

        afterEach(() => {
            Object.defineProperty(navigator, "clipboard", {
                value: undefined,
                configurable: true,
                writable: true,
            });
        });

        it("returns true", () => {
            const { result } = renderHook(() => useClipboardAvailable());
            expect(result.current).toBe(true);
        });
    });

    describe("when navigator.clipboard is absent", () => {
        beforeEach(() => {
            Object.defineProperty(navigator, "clipboard", {
                value: undefined,
                configurable: true,
                writable: true,
            });
        });

        it("returns false", () => {
            const { result } = renderHook(() => useClipboardAvailable());
            expect(result.current).toBe(false);
        });
    });
});
