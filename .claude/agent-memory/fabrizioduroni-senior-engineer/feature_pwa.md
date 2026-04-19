---
name: PWA Feature
description: Full PWA implementation — Serwist configurator mode, offline caching, install prompt, background sync
type: project
---

## Status: Complete, on branch feat/ux-pwa-capabilities (PR #289)

## Architecture

### Serwist — Configurator Mode
- `next.config.ts` has ZERO Serwist code — clean separation, bundler-agnostic
- `serwist.config.js` uses `serwist.withNextConfig` to receive resolved Next.js config
- `serwist build` runs as a post-build step: `next build && serwist build`
- `predev` also builds SW: `npm run search-index && NODE_ENV=development serwist build`
- SW output: `public/sw.js` (gitignored via `public/sw*`)
- Precache: 683 URLs, 65.8 MB (JS/CSS chunks + public assets, NOT images or PDF)

### `globIgnores` (serwist.config.js)
Must exclude large assets or the precache balloons to 290 MB:
```js
"public/images/**",
"public/tesi-fabrizio-duroni-770157.pdf",
"public/chicio-coding-feature-graphic.png",
"public/chicio-coding-feature-graphic.jpg",
"public/chicio-art-featured.png",
"public/search-index.json",
```

### Service Worker (`src/app/sw.ts`)
Three custom rules prepended before `...defaultCache`:
1. `NetworkOnly` for `/api/*` — chat/contact must never be cached
2. `CacheFirst` (500 entries, 30d) for `request.destination === "image"` with `handlerDidError` returning a Matrix SVG placeholder
3. `NetworkFirst` (100 entries, 3d, `networkTimeoutSeconds: 10`) for `navigate` mode with explicit `handlerDidError` serving the cached `/offline` page

**Critical gotcha**: `caches.match("/offline", { ignoreSearch: true })` — MUST use `ignoreSearch: true`. Serwist stores non-versioned precache URLs with `__WB_REVISION__` as a query param, so an exact URL match always returns undefined.

**Critical gotcha**: Serwist `fallbacks` config only attaches to the precache route, NOT to custom `runtimeCaching` rules. Must add `handlerDidError` explicitly to navigation handler.

**Critical gotcha**: `/offline` must NOT be in `additionalPrecacheEntries` — Serwist's glob scan already picks it up from the `.next/` build output. Adding it manually creates a conflicting-entries error (two different revisions for the same URL).

### `defaultCache` from `@serwist/next/worker`
- In development: single `NetworkOnly` catch-all (safe, no caching in dev)
- In production: covers Google Fonts (CacheFirst gstatic 365d, SWR googleapis 7d), static JS/CSS, `/_next/image`, RSC prefetch/RSC payloads (32 entries each), audio/video with RangeRequestsPlugin, cross-origin
- We intentionally override images (CacheFirst vs SWR) and navigation (adds timeout) and API (NetworkOnly vs NetworkFirst GET)

### Offline Behavior
- All `/_next/static/` JS/CSS chunks are precached → all page JS available offline immediately
- Next.js App Router prefetches RSC payloads for visible links → cached by defaultCache's RSC rules
- Result: near-complete offline coverage for client-side navigation after any normal browsing session
- Hard navigation (refresh/direct URL) to unvisited page → Matrix `/offline` fallback
- Images not in cache → Matrix SVG placeholder (`> IMAGE_UNAVAILABLE`)

### Offline Page (`src/app/offline/page.tsx`)
Matches 404 page structure exactly:
- `MatrixRain` fullscreen background
- "OFFLINE" heading with `animate-glitch`
- `MatrixTerminal` with typewriter animation (connection error lines)
- `BluePillLink` to "/" + `RedPillButton` for `window.location.reload()`
- `"use client"` required for reload button

### Install Prompt (`src/components/sections/pwa/`)
- `use-install-prompt.ts`: captures `beforeinstallprompt`, checks `display-mode: standalone`
- `install-prompt-banner.tsx`: uses `useConsentStore` — only shows when cookie consent is ACCEPTED
  - Reasoning: prompt fires GA tracking events → inconsistent to show to users who rejected tracking
  - Eliminates banner overlap with cookie consent banner
- Uses `useGlassmorphism` + same layout as `cookie-consent-banner.tsx` (identical CSS classes)
- `beforeinstallprompt` is Chromium-only — Safari/Firefox never see the prompt

### Background Sync (`src/lib/background-sync/contact-queue.ts`)
- localStorage queue (key: `fabrizioduroni_contact_queue`)
- Cross-browser including Safari (SW Background Sync API not supported on Safari)
- `useOfflineContactQueue` hook mounted in `layout-additional-content.tsx` replays on `online` event
- Contact form detects `navigator.onLine`, queues offline submissions

### `useConsentStore` (`src/components/design-system/utils/hooks/use-consent-store.ts`)
New hook following `useMotionStore` pattern exactly:
- `useSyncExternalStore` subscribing to `consentChangeEvent` from `src/lib/consents/consents.ts`
- `writeConsent` dispatches `consentChangeEvent` (camelCase, matching `motionChangeEvent`)
- `getServerSnapshot` returns `false` (no consent on server)
- Reusable for any component that needs to react to consent changes

## Known Issues / Debugging History

### Bad exercise slug (fixed)
`src/content/data-structures-and-algorithms/topic/tries/exercise/maximum-XOR-of-two-numbers-in-an -array` had a literal space in the directory name → URL with `%20` → `bad-precaching-response` SW install failure. Renamed to `maximum-xor-of-two-numbers-in-an-array`.

### Precache cache key format
Serwist stores non-versioned URLs with revision as query param: `/offline?__WB_REVISION__=abc123`. Always use `{ ignoreSearch: true }` when calling `caches.match` for precached non-versioned URLs.

### Lighthouse PWA category removed
Google removed the PWA category from Lighthouse v12 (late 2024). Use DevTools → Application → Manifest for validation instead.

### Testing install prompt reset
- DevTools → Application → Manifest → "Add to homescreen" triggers `beforeinstallprompt` on demand
- `chrome://flags/#bypass-app-banner-engagement-checks` bypasses Chrome's cooldown after dismiss
- Uninstall via right-click app title bar → Uninstall (if fully installed)

### Preview deployments block SW
Vercel preview URLs have deployment protection → `sw.js` returns 401 → SW install fails. Test PWA locally with `npm run build && npm start` only.
