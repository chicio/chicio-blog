import { describe, it, expect, vi, beforeEach } from "vitest";
import { spoonActivationEvent, activateSpoonEasterEgg, trySpoonPhrase } from "./spoon-activation";

describe("spoon-activation", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe("activateSpoonEasterEgg", () => {
        it("dispatches the activation event on window", () => {
            const listener = vi.fn();
            window.addEventListener(spoonActivationEvent, listener);

            activateSpoonEasterEgg();

            expect(listener).toHaveBeenCalledTimes(1);
            window.removeEventListener(spoonActivationEvent, listener);
        });
    });

    describe("trySpoonPhrase", () => {
        it("dispatches the activation event and returns true on an exact match", () => {
            const listener = vi.fn();
            window.addEventListener(spoonActivationEvent, listener);

            expect(trySpoonPhrase("there is no spoon")).toBe(true);
            expect(listener).toHaveBeenCalledTimes(1);

            window.removeEventListener(spoonActivationEvent, listener);
        });

        it("is tolerant of case and spacing", () => {
            const listener = vi.fn();
            window.addEventListener(spoonActivationEvent, listener);

            expect(trySpoonPhrase("THERE   IS NO   SPOON")).toBe(true);
            expect(listener).toHaveBeenCalledTimes(1);

            window.removeEventListener(spoonActivationEvent, listener);
        });

        it("matches when the phrase ends a longer sentence", () => {
            const listener = vi.fn();
            window.addEventListener(spoonActivationEvent, listener);

            expect(trySpoonPhrase("what is the truth? there is no spoon")).toBe(true);
            expect(listener).toHaveBeenCalledTimes(1);

            window.removeEventListener(spoonActivationEvent, listener);
        });

        it("dispatches nothing and returns false for a non-matching message", () => {
            const listener = vi.fn();
            window.addEventListener(spoonActivationEvent, listener);

            expect(trySpoonPhrase("there is no fork")).toBe(false);
            expect(listener).not.toHaveBeenCalled();

            window.removeEventListener(spoonActivationEvent, listener);
        });
    });
});
