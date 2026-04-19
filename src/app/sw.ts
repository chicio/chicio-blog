/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, NetworkFirst, NetworkOnly, Serwist, ExpirationPlugin } from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,

    runtimeCaching: [
        // ─── API routes: never cache (chat and contact must always hit the network)
        {
            matcher: ({ url }) => url.pathname.startsWith("/api/"),
            handler: new NetworkOnly(),
        },

        // ─── Static images: cache-first, 30-day expiry ─────────────────────
        // Uses request.destination (more reliable than file extension matching)
        // and CacheFirst (images are effectively immutable on this site).
        // defaultCache uses StaleWhileRevalidate for image extensions — we intentionally override.
        {
            matcher: ({ request }) => request.destination === "image",
            handler: new CacheFirst({
                cacheName: "images",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 200,
                        maxAgeSeconds: 30 * 24 * 60 * 60,
                        purgeOnQuotaError: true,
                    }),
                ],
            }),
        },

        // ─── Navigation: network-first with timeout, 3-day offline fallback ─
        // networkTimeoutSeconds ensures the offline page is served promptly
        // on a dead/slow network. defaultCache has no timeout on its HTML rule.
        {
            matcher: ({ request }) => request.mode === "navigate",
            handler: new NetworkFirst({
                cacheName: "pages",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 100,
                        maxAgeSeconds: 3 * 24 * 60 * 60,
                        purgeOnQuotaError: true,
                    }),
                ],
                networkTimeoutSeconds: 10,
            }),
        },

        // ─── Everything else: serwist's recommended defaults ────────────────
        // Covers: Google Fonts (CacheFirst gstatic, SWR googleapis), static JS/CSS,
        // Next.js image optimisation route, RSC prefetch + RSC payloads,
        // audio/video (with RangeRequestsPlugin), cross-origin requests.
        ...defaultCache,
    ],

    fallbacks: {
        entries: [
            {
                url: "/offline",
                matcher({ request }) {
                    return request.destination === "document";
                },
            },
        ],
    },
});

serwist.addEventListeners();
