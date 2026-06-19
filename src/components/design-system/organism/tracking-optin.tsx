"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useConsentStore } from "@/components/design-system/hooks/use-consent-store";

const TrackingOptIn = () => {
  const enabled = useConsentStore();

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

export default TrackingOptIn;
