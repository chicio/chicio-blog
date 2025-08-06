import {TrackingData, TrackingPayload} from "@/types/tracking";

export const trackWith = (tracking: TrackingData) => {
    const payload: TrackingPayload = { event_category: tracking.category, event_label: tracking.label }

    if (typeof window !== "undefined" && typeof window.gtag !== "undefined") {
        window.gtag("event", tracking.action, payload);
    }
};
