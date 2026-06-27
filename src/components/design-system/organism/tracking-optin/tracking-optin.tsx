"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

interface TrackingOptInProps {
    enabled: boolean;
}

export const TrackingOptIn = ({ enabled }: TrackingOptInProps) => {
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
