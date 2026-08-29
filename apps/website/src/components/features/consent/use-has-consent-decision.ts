import { useSyncExternalStore } from "react";
import { consentChangeEvent, hasMadeConsentDecision } from "@/lib/consents/consents";

const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") {
        return () => {};
    }

    window.addEventListener(consentChangeEvent, callback);

    return () => {
        window.removeEventListener(consentChangeEvent, callback);
    };
};

const getSnapshot = () => hasMadeConsentDecision();

const getServerSnapshot = () => true;

export const useHasConsentDecision = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
