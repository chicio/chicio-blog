"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useTrackingOptinStore } from "./use-tracking-optin-store";

interface TrackingOptInProps {
    enabled: boolean;
}

export const TrackingOptIn = ({ enabled }: TrackingOptInProps) => {
    const { state } = useTrackingOptinStore(enabled);
    const { enabled } = state;

    if (!enabled) {
        return null;
    }

    return (
        <>
            <GoogleAnalytics gaId="G-B992TEM300" />
            <SpeedInsights />
            <Analytics />
        </>
    );
};
