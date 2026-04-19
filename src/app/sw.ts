/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate, Serwist, ExpirationPlugin } from "serwist";

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

        // ─── Google Fonts: stale-while-revalidate, 1-year cache ────────────
        {
            matcher: ({ url }) =>
                url.origin === "https://fonts.googleapis.com" ||
                url.origin === "https://fonts.gstatic.com",
            handler: new StaleWhileRevalidate({
                cacheName: "google-fonts",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 10,
                        maxAgeSeconds: 365 * 24 * 60 * 60,
                    }),
                ],
            }),
        },

        // ─── Navigation: network-first, 3-day offline fallback ─────────────
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
