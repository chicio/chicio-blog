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

const OFFLINE_IMAGE_PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
  <rect width="800" height="450" fill="#000"/>
  <rect x="1" y="1" width="798" height="448" fill="none" stroke="#00ff41" stroke-width="1" opacity="0.3"/>
  <text x="400" y="195" font-family="monospace" font-size="15" fill="#00ff41" text-anchor="middle" opacity="0.9">&gt; IMAGE_UNAVAILABLE</text>
  <text x="400" y="225" font-family="monospace" font-size="11" fill="#00ff41" text-anchor="middle" opacity="0.5">cached version not found</text>
  <text x="400" y="248" font-family="monospace" font-size="11" fill="#00ff41" text-anchor="middle" opacity="0.5">reconnect to load_</text>
</svg>`;

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

        // ─── Static images: cache-first, 30-day expiry, SVG placeholder offline ─
        // Uses request.destination (more reliable than file extension matching)
        // and CacheFirst (images are effectively immutable on this site).
        // handlerDidError returns a Matrix-themed SVG when the image is not in
        // cache and the network is unavailable.
        {
            matcher: ({ request }) => request.destination === "image",
            handler: new CacheFirst({
                cacheName: "images",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 500,
                        maxAgeSeconds: 30 * 24 * 60 * 60,
                        purgeOnQuotaError: true,
                    }),
                    {
                        handlerDidError: async () =>
                            new Response(OFFLINE_IMAGE_PLACEHOLDER, {
                                headers: { "Content-Type": "image/svg+xml" },
                            }),
                    },
                ],
            }),
        },

        // ─── Navigation: network-first with timeout, explicit offline fallback ──
        // networkTimeoutSeconds ensures cache is tried promptly on slow networks.
        // handlerDidError is required here: Serwist's `fallbacks` config only
        // attaches to the precache route, not to custom runtimeCaching rules.
        // Without it, a navigation to an uncached page while offline throws and
        // the browser spins forever instead of showing the offline page.
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
                    {
                        handlerDidError: async () =>
                            (await caches.match("/offline")) ?? Response.error(),
                    },
                ],
                networkTimeoutSeconds: 10,
            }),
        },

        // ─── Everything else: serwist's recommended defaults ─────────────────────
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
