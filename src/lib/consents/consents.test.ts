import { describe, it, expect, vi, beforeEach } from "vitest";
import { hasConsented, hasMadeConsentDecision, writeConsent, consentChangeEvent } from "./consents";

const STORAGE_KEY = "fabrizioduroni_cookieConsent";

describe("hasConsented", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("returns true when consent value is 'accepted'", () => {
        localStorage.setItem(STORAGE_KEY, "accepted");
        expect(hasConsented()).toBe(true);
    });

    it("returns false when consent value is 'rejected'", () => {
        localStorage.setItem(STORAGE_KEY, "rejected");
        expect(hasConsented()).toBe(false);
    });

    it("returns false when no consent decision has been stored", () => {
        expect(hasConsented()).toBe(false);
    });
});

describe("hasMadeConsentDecision", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("returns true when a value is stored (accepted)", () => {
        localStorage.setItem(STORAGE_KEY, "accepted");
        expect(hasMadeConsentDecision()).toBe(true);
    });

    it("returns true when a value is stored (rejected)", () => {
        localStorage.setItem(STORAGE_KEY, "rejected");
        expect(hasMadeConsentDecision()).toBe(true);
    });

    it("returns false when nothing is stored", () => {
        expect(hasMadeConsentDecision()).toBe(false);
    });
});

describe("writeConsent", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("writes 'accepted' to local storage under the namespaced key", () => {
        writeConsent("accepted");
        expect(localStorage.getItem(STORAGE_KEY)).toBe("accepted");
    });

    it("writes 'rejected' to local storage under the namespaced key", () => {
        writeConsent("rejected");
        expect(localStorage.getItem(STORAGE_KEY)).toBe("rejected");
    });

    it("dispatches a cookieConsentChanged event with the decision as detail", () => {
        const listener = vi.fn();
        window.addEventListener(consentChangeEvent, listener);
        writeConsent("accepted");
        window.removeEventListener(consentChangeEvent, listener);
        expect(listener).toHaveBeenCalledOnce();
        const event = listener.mock.calls[0][0] as CustomEvent;
        expect(event.detail).toBe("accepted");
    });

    it("round-trips: write accepted then read it back via hasConsented", () => {
        writeConsent("accepted");
        expect(hasConsented()).toBe(true);
    });

    it("round-trips: write rejected then hasMadeConsentDecision returns true", () => {
        writeConsent("rejected");
        expect(hasMadeConsentDecision()).toBe(true);
        expect(hasConsented()).toBe(false);
    });
});
