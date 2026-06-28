import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInViewList } from "./use-in-view-list";

type IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => void;

let capturedCallbacks: IntersectionObserverCallback[] = [];
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();

function makeEntry(target: Element, isIntersecting: boolean): IntersectionObserverEntry {
    return { target, isIntersecting } as IntersectionObserverEntry;
}

class FakeIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
        capturedCallbacks.push(callback);
    }
    observe = mockObserve;
    unobserve = mockUnobserve;
    disconnect = vi.fn();
}

describe("useInViewList", () => {
    beforeEach(() => {
        capturedCallbacks = [];
        mockObserve.mockClear();
        mockUnobserve.mockClear();
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe("initial state", () => {
        it("returns false for isInView initially", () => {
            const { result } = renderHook(() => useInViewList({ rootMargin: "0px" }));
            const [, isInView] = result.current;
            expect(isInView).toBe(false);
        });

        it("returns a callback ref setter", () => {
            const { result } = renderHook(() => useInViewList({ rootMargin: "0px" }));
            const [setEl] = result.current;
            expect(typeof setEl).toBe("function");
        });
    });

    describe("when element is set and enters viewport", () => {
        it("sets isInView to true", async () => {
            const { result } = renderHook(() => useInViewList({ rootMargin: "0px" }));
            const el = document.createElement("div");

            await act(async () => {
                const [setEl] = result.current;
                setEl(el);
            });

            await act(async () => {
                const lastCallback = capturedCallbacks[capturedCallbacks.length - 1];
                lastCallback?.([makeEntry(el, true)]);
            });

            const [, isInView] = result.current;
            expect(isInView).toBe(true);
        });
    });

    describe("cleanup", () => {
        it("calls unobserve when element is removed", async () => {
            const { result, unmount } = renderHook(() => useInViewList({ rootMargin: "0px" }));
            const el = document.createElement("div");

            await act(async () => {
                const [setEl] = result.current;
                setEl(el);
            });

            unmount();

            expect(mockUnobserve).toHaveBeenCalledWith(el);
        });
    });
});
