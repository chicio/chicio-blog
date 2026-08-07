import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    closeEasterEgg,
    getEasterEggOverlaySlug,
    openEasterEgg,
    subscribeToEasterEggOverlay,
} from "./easter-egg-overlay-state";

describe("easter-egg-overlay-state", () => {
    beforeEach(() => {
        closeEasterEgg();
    });

    describe("getEasterEggOverlaySlug", () => {
        it("returns null when no egg is open", () => {
            expect(getEasterEggOverlaySlug()).toBeNull();
        });

        it("returns the slug set by openEasterEgg", () => {
            openEasterEgg("the-one");
            expect(getEasterEggOverlaySlug()).toBe("the-one");
        });

        it("returns null again after closeEasterEgg", () => {
            openEasterEgg("the-one");
            closeEasterEgg();
            expect(getEasterEggOverlaySlug()).toBeNull();
        });

        it("is referentially stable across repeated reads with no change in between", () => {
            openEasterEgg("dodge-this");
            const first = getEasterEggOverlaySlug();
            const second = getEasterEggOverlaySlug();
            expect(first).toBe(second);
        });
    });

    describe("subscribeToEasterEggOverlay", () => {
        it("notifies subscribers when the egg opens", () => {
            const callback = vi.fn();
            const unsubscribe = subscribeToEasterEggOverlay(callback);

            openEasterEgg("the-choice");

            expect(callback).toHaveBeenCalledOnce();
            unsubscribe();
        });

        it("notifies subscribers when the egg closes", () => {
            openEasterEgg("the-choice");
            const callback = vi.fn();
            const unsubscribe = subscribeToEasterEggOverlay(callback);

            closeEasterEgg();

            expect(callback).toHaveBeenCalledOnce();
            unsubscribe();
        });

        it("stops notifying after unsubscribing", () => {
            const callback = vi.fn();
            const unsubscribe = subscribeToEasterEggOverlay(callback);
            unsubscribe();

            openEasterEgg("the-white-rabbit");

            expect(callback).not.toHaveBeenCalled();
        });

        it("supports multiple independent subscribers", () => {
            const first = vi.fn();
            const second = vi.fn();
            const unsubscribeFirst = subscribeToEasterEggOverlay(first);
            const unsubscribeSecond = subscribeToEasterEggOverlay(second);

            openEasterEgg("i-know-kung-fu");

            expect(first).toHaveBeenCalledOnce();
            expect(second).toHaveBeenCalledOnce();
            unsubscribeFirst();
            unsubscribeSecond();
        });
    });
});
