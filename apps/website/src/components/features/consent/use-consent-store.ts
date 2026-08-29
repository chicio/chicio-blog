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

const getServerSnapshot = () => false;

export const useConsentStore = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
