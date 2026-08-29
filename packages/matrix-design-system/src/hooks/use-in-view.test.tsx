import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { render } from "@testing-library/react";
import { useInView } from "./use-in-view";
import React from "react";

type IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => void;

let capturedCallbacks: IntersectionObserverCallback[] = [];

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class FakeIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
        capturedCallbacks.push(callback);
    }
    observe = mockObserve;
    unobserve = vi.fn();
    disconnect = mockDisconnect;
}

function makeEntry(target: Element, isIntersecting: boolean): IntersectionObserverEntry {
    return { target, isIntersecting } as IntersectionObserverEntry;
}

function HookConsumer({ triggerOnce }: { triggerOnce?: boolean }) {
    const [ref, isInView] = useInView({ triggerOnce });
    return <div ref={ref} data-testid="target" data-in-view={String(isInView)} />;
}

describe("useInView", () => {
    beforeEach(() => {
        capturedCallbacks = [];
        mockObserve.mockClear();
        mockDisconnect.mockClear();
        vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe("initial state", () => {
        it("returns false initially", () => {
            const { result } = renderHook(() => useInView());
            const [, isInView] = result.current;
            expect(isInView).toBe(false);
        });

        it("returns a ref object", () => {
            const { result } = renderHook(() => useInView());
            const [ref] = result.current;
            expect(ref).toHaveProperty("current");
        });
    });

    describe("when element enters viewport", () => {
        it("sets isInView to true", async () => {
            const { getByTestId } = render(<HookConsumer />);
            const target = getByTestId("target");

            await act(async () => {
                const cb = capturedCallbacks[capturedCallbacks.length - 1];
                cb?.([makeEntry(target, true)]);
            });

            expect(target.dataset.inView).toBe("true");
        });
    });

    describe("when element leaves viewport (without triggerOnce)", () => {
        it("sets isInView back to false", async () => {
            const { getByTestId } = render(<HookConsumer triggerOnce={false} />);
            const target = getByTestId("target");

            await act(async () => {
                const cb = capturedCallbacks[capturedCallbacks.length - 1];
                cb?.([makeEntry(target, true)]);
            });

            await act(async () => {
                const cb = capturedCallbacks[capturedCallbacks.length - 1];
                cb?.([makeEntry(target, false)]);
            });

            expect(target.dataset.inView).toBe("false");
        });
    });

    describe("when triggerOnce is true", () => {
        it("does not reset isInView to false after leaving viewport", async () => {
            const { getByTestId } = render(<HookConsumer triggerOnce={true} />);
            const target = getByTestId("target");

            await act(async () => {
                const cb = capturedCallbacks[capturedCallbacks.length - 1];
                cb?.([makeEntry(target, true)]);
            });

            await act(async () => {
                const cb = capturedCallbacks[capturedCallbacks.length - 1];
                cb?.([makeEntry(target, false)]);
            });

            expect(target.dataset.inView).toBe("true");
        });
    });
});
