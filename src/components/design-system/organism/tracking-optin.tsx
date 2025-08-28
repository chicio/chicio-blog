"use client";
import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { hasConsented } from "@/lib/consents/consents";

export const TrackingOptIn = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(hasConsented());
    const handler = () => setEnabled(hasConsented());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!enabled) return null;
  return <>
    <SpeedInsights />
    <Analytics />
  </>;
};
