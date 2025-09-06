"use client";

import { hasConsented } from "@/lib/consents/consents";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";

export const TrackingOptIn = () => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(hasConsented());
    const handler = () => {
      const hasConsentedTracking = hasConsented();
      return setEnabled(hasConsentedTracking);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

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
