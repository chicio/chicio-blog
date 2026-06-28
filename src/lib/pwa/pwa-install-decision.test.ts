import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    readPwaInstallDecision,
    writePwaInstallDecision,
    pwaInstallDecisionChangeEvent,
} from "./pwa-install-decision";

const STORAGE_KEY = "fabrizioduroni_pwaInstallDecision";

describe("pwa-install-decision", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("readPwaInstallDecision", () => {
        it("returns 'dismissed' when that value is stored", () => {
            localStorage.setItem(STORAGE_KEY, "dismissed");
            expect(readPwaInstallDecision()).toBe("dismissed");
        });

        it("returns 'installed' when that value is stored", () => {
            localStorage.setItem(STORAGE_KEY, "installed");
            expect(readPwaInstallDecision()).toBe("installed");
        });

        it("returns null when nothing is stored", () => {
            expect(readPwaInstallDecision()).toBeNull();
        });

        it("returns null for an unrecognised value", () => {
            localStorage.setItem(STORAGE_KEY, "unknown-value");
            expect(readPwaInstallDecision()).toBeNull();
        });
    });

    describe("writePwaInstallDecision", () => {
        it("persists 'dismissed' to localStorage", () => {
            writePwaInstallDecision("dismissed");
            expect(localStorage.getItem(STORAGE_KEY)).toBe("dismissed");
        });

        it("persists 'installed' to localStorage", () => {
            writePwaInstallDecision("installed");
            expect(localStorage.getItem(STORAGE_KEY)).toBe("installed");
        });

        it("dispatches the pwaInstallDecisionChanged custom event with the value as detail", () => {
            const listener = vi.fn();
            window.addEventListener(pwaInstallDecisionChangeEvent, listener);
            writePwaInstallDecision("dismissed");
            window.removeEventListener(pwaInstallDecisionChangeEvent, listener);
            expect(listener).toHaveBeenCalledOnce();
            const event = listener.mock.calls[0][0] as CustomEvent;
            expect(event.detail).toBe("dismissed");
        });

        it("round-trips: write then read back the same value", () => {
            writePwaInstallDecision("installed");
            expect(readPwaInstallDecision()).toBe("installed");
        });
    });
});
