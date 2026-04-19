import { useSyncExternalStore } from "react";
import { hasConsented, CONSENT_CHANGED_EVENT } from "@/lib/consents/consents";

const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") {
        return () => {};
    }

    window.addEventListener(CONSENT_CHANGED_EVENT, callback);

    return () => {
        window.removeEventListener(CONSENT_CHANGED_EVENT, callback);
    };
};

const getSnapshot = () => hasConsented();

const getServerSnapshot = () => false; // No consent on server

/**
 * React hook to subscribe to cookie consent state using useSyncExternalStore.
 * Returns true if the user has accepted cookies, false otherwise.
 *
 * Behavior:
 * - Current tab: Changes sync immediately via CONSENT_CHANGED_EVENT
 * - New tabs: Automatically read from localStorage on mount
 * - SSR: Defaults to false to prevent hydration mismatches
 */
export const useConsentStore = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
