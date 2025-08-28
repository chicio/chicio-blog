import {TrackingData, TrackingPayload} from "@/types/tracking";
import { hasConsented } from "@/lib/consents/consents";

export const trackWith = (tracking: TrackingData) => {
    const payload: TrackingPayload = { event_category: tracking.category, event_label: tracking.label }

    if (typeof window !== "undefined" && typeof window.gtag !== "undefined" && hasConsented()) {
        window.gtag("event", tracking.action, payload);
    }
};
