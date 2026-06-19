import { useSyncExternalStore } from "react";
import { hasConsented, consentChangeEvent } from "@/lib/consents/consents";

const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") {
        return () => {};
    }

    window.addEventListener(consentChangeEvent, callback);

    return () => {
        window.removeEventListener(consentChangeEvent, callback);
    };
};

const getSnapshot = () => hasConsented();

const getServerSnapshot = () => false; // No consent on server

/**
 * React hook to subscribe to cookie consent state using useSyncExternalStore.
 * Returns true if the user has accepted cookies, false otherwise.
 *
 * Behavior:
 * - Current tab: Changes sync immediately via consentChangeEvent
 * - New tabs: Automatically read from localStorage on mount
 * - SSR: Defaults to false to prevent hydration mismatches
 */
export const useConsentStore = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
