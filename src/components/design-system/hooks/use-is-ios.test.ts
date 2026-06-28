import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsIOS } from "./use-is-ios";

describe("useIsIOS", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("when user agent is an iPhone", () => {
        it("returns true", () => {
            vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
            );
            const { result } = renderHook(() => useIsIOS());
            expect(result.current).toBe(true);
        });
    });

    describe("when user agent is an iPad", () => {
        it("returns true", () => {
            vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(
                "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)",
            );
            const { result } = renderHook(() => useIsIOS());
            expect(result.current).toBe(true);
        });
    });

    describe("when user agent is an iPod", () => {
        it("returns true", () => {
            vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(
                "Mozilla/5.0 (iPod touch; CPU iPhone OS 17_0 like Mac OS X)",
            );
            const { result } = renderHook(() => useIsIOS());
            expect(result.current).toBe(true);
        });
    });

    describe("when user agent is Chrome on macOS", () => {
        it("returns false", () => {
            vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            );
            const { result } = renderHook(() => useIsIOS());
            expect(result.current).toBe(false);
        });
    });

    describe("when user agent is Chrome on Windows", () => {
        it("returns false", () => {
            vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            );
            const { result } = renderHook(() => useIsIOS());
            expect(result.current).toBe(false);
        });
    });
});
