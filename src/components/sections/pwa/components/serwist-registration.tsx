"use client";

import { useEffect } from "react";

/**
 * Registers the Serwist service worker in production.
 * Mounted once at the root layout level — renders nothing.
 */
export function SerwistRegistration() {
    useEffect(() => {
        if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js").catch((err) => {
                console.error("[Serwist] Service worker registration failed:", err);
            });
        }
    }, []);

    return null;
}
