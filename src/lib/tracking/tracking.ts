import { hasConsented } from "@/lib/consents/consents";
import { TrackingData, TrackingPayload } from "@/types/tracking";
import { sendGAEvent } from "@next/third-parties/google";

export const trackWith = (tracking: TrackingData) => {
    const payload: TrackingPayload = { event_category: tracking.category, event_label: tracking.label }

    if (hasConsented()) {
        sendGAEvent('event', tracking.action, payload);
    }
};
