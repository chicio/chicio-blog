import { describe, it, expect, vi } from "vitest";
import {
    revealAllSolutionsEvent,
    subscribeToRevealAllSolutions,
    triggerRevealAllSolutions,
} from "./reveal-all-signal";

describe("reveal-all-signal", () => {
    describe("triggerRevealAllSolutions", () => {
        it("notifies subscribers", () => {
            const callback = vi.fn();
            const unsubscribe = subscribeToRevealAllSolutions(callback);
            triggerRevealAllSolutions();
            expect(callback).toHaveBeenCalledOnce();
            unsubscribe();
        });

        it("dispatches the documented event name", () => {
            const listener = vi.fn();
            window.addEventListener(revealAllSolutionsEvent, listener);
            triggerRevealAllSolutions();
            window.removeEventListener(revealAllSolutionsEvent, listener);
            expect(listener).toHaveBeenCalledOnce();
        });
    });

    describe("subscribeToRevealAllSolutions", () => {
        it("stops notifying after unsubscribing", () => {
            const callback = vi.fn();
            const unsubscribe = subscribeToRevealAllSolutions(callback);
            unsubscribe();
            triggerRevealAllSolutions();
            expect(callback).not.toHaveBeenCalled();
        });
    });
});
