import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate, Serwist } from "serwist";
import { ExpirationPlugin } from "serwist";

// Augment the global ServiceWorkerGlobalScope with Serwist's injected manifest
declare global {
    interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
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
        // ─── API routes: never cache, always network ───────────────────────
        {
            matcher: ({ url }) => url.pathname.startsWith("/api/"),
            handler: new NetworkOnly(),
        },

        // ─── Static images: cache-first with 30-day expiry ─────────────────
        {
            matcher: ({ request }) => request.destination === "image",
            handler: new CacheFirst({
                cacheName: "images",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 200,
                        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                        purgeOnQuotaError: true,
                    }),
                ],
            }),
        },

        // ─── Google Fonts stylesheets: stale-while-revalidate ──────────────
        {
            matcher: ({ url }) =>
                url.origin === "https://fonts.googleapis.com" ||
                url.origin === "https://fonts.gstatic.com",
            handler: new StaleWhileRevalidate({
                cacheName: "google-fonts",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 10,
                        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                    }),
                ],
            }),
        },

        // ─── All other navigation / pages: network-first with 3-day fallback
        {
            matcher: ({ request }) => request.mode === "navigate",
            handler: new NetworkFirst({
                cacheName: "pages",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 100,
                        maxAgeSeconds: 3 * 24 * 60 * 60, // 3 days
                        purgeOnQuotaError: true,
                    }),
                ],
                networkTimeoutSeconds: 10,
            }),
        },

        // ─── Everything else (scripts, styles, fonts): network-first ────────
        {
            matcher: () => true,
            handler: new NetworkFirst({
                cacheName: "default",
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 64,
                        maxAgeSeconds: 24 * 60 * 60, // 1 day
                        purgeOnQuotaError: true,
                    }),
                ],
            }),
        },
    ],

    // Serve /offline when a navigation fails and there's no cached version
    fallbacks: {
        entries: [
            {
                url: "/offline",
                matcher({ request }) {
                    return request.mode === "navigate";
                },
            },
        ],
    },
});

serwist.addEventListeners();
