---
name: PWA Feature
description: Full PWA implementation — Serwist configurator mode, offline caching, install prompt, background sync
type: project
---

## Status: Complete, merged (PR #289). Precache optimized (2026-04-23).

## Architecture

### Serwist — Configurator Mode
- `apps/website/next.config.ts` has ZERO Serwist code — clean separation, bundler-agnostic
- `apps/website/serwist.config.mjs` uses `serwist.withNextConfig` to receive resolved Next.js config
- `serwist build` now runs inside the prebuild step (`apps/website/src/lib/build/prebuild.ts`, after the search index
  and media copy), wired as `prebuild`/`predev` (`predev` sets `NODE_ENV=development`); verified 2026-09-27
- SW output: `apps/website/public/sw.js` (gitignored via `public/sw*` in `apps/website/.gitignore`)

### Precache Optimization (2026-04-23)
**Problem**: The original config precached ~685 URLs (590 HTML pages + JS/CSS chunks + static assets). Every visitor's SW install fetched all 685 resources from Vercel's edge cache, each counting as an ISR read. With `skipWaiting: true`, every new deploy triggered re-precaching for all active visitors. This caused ISR reads to spike from ~5k/day to 190k+/day, exceeding Vercel's Hobby plan limit (1,004,960 / 1,000,000 in 30 days).

**Fix**: Three config changes in `serwist.config.mjs`:
1. `precachePrerendered: false` — stops auto-including all 590+ HTML pages (this is the key one; `@serwist/next` defaults this to `true` and appends `.next/server/{app,pages}/**/*.html` to globPatterns)
2. `globPatterns: []` — stops including JS chunks and static assets from the build output
3. `additionalPrecacheEntries: [{ url: "/offline", revision }]` — manually precaches only the offline fallback page (with git HEAD as revision)

**Result**: Precache dropped from 685 entries to 1 (`/offline` only). All other pages are cached at runtime by the `NetworkFirst` handler in `sw.ts` as users navigate. The offline experience is preserved — visited pages work offline, unvisited pages show the `/offline` fallback.

**Important**: The `exclude` option does NOT work with `@serwist/cli` (v9.x) — it throws "Received unrecognized keys: exclude". Use `globPatterns: []` + `precachePrerendered: false` instead.

### `globIgnores` (removed)
An older `globIgnores` list (public images, the thesis PDF, feature graphics, search-index.json) is no longer in
`serwist.config.mjs`; with `globPatterns: []` it had nothing to filter.

### Service Worker (`apps/website/src/app/sw.ts`)
Three custom rules prepended before `...defaultCache`:
1. `NetworkOnly` for `/api/*` — chat/contact must never be cached
2. `CacheFirst` (500 entries, 30d) for `request.destination === "image"` with `handlerDidError` returning a Matrix SVG placeholder
3. `NetworkFirst` (100 entries, 3d, `networkTimeoutSeconds: 10`) for `navigate` mode with explicit `handlerDidError` serving the cached `/offline` page

**Critical gotcha**: `caches.match("/offline", { ignoreSearch: true })` — MUST use `ignoreSearch: true`. Serwist stores non-versioned precache URLs with `__WB_REVISION__` as a query param, so an exact URL match always returns undefined.

**Critical gotcha**: Serwist `fallbacks` config only attaches to the precache route, NOT to custom `runtimeCaching` rules. Must add `handlerDidError` explicitly to navigation handler.

**Note**: After the precache optimization, `/offline` IS in `additionalPrecacheEntries` with the git revision — this is now the ONLY precache entry. Previously (when `precachePrerendered` was true), adding it manually caused conflicting-entries errors because Serwist's glob scan also picked it up.

### `defaultCache` from `@serwist/next/worker`
- In development: single `NetworkOnly` catch-all (safe, no caching in dev)
- In production: covers Google Fonts (CacheFirst gstatic 365d, SWR googleapis 7d), static JS/CSS, `/_next/image`, RSC prefetch/RSC payloads (32 entries each), audio/video with RangeRequestsPlugin, cross-origin
- We intentionally override images (CacheFirst vs SWR) and navigation (adds timeout) and API (NetworkOnly vs NetworkFirst GET)

### Offline Behavior (post-optimization)
- Only `/offline` is precached — JS/CSS chunks and pages are NO longer precached upfront
- As users browse, pages are cached by `NetworkFirst` runtime handler (100 entries, 3d expiry)
- JS/CSS and other static assets are cached by `defaultCache` rules from `@serwist/next/worker`
- Next.js App Router prefetches RSC payloads for visible links → cached by defaultCache's RSC rules
- Result: offline coverage for previously visited pages after normal browsing session
- Hard navigation (refresh/direct URL) to unvisited page → Matrix `/offline` fallback
- Images not in cache → Matrix SVG placeholder (`> IMAGE_UNAVAILABLE`)

### Offline Page (`apps/website/src/app/offline/page.tsx`)
Matches 404 page structure exactly:
- `MatrixRain` fullscreen background
- "OFFLINE" heading with `animate-glitch`
- `MatrixTerminal` with typewriter animation (connection error lines)
- `BluePillLink` to "/" + `RedPillButton` for `window.location.reload()`
- `"use client"` required for reload button

### Install Prompt (`apps/website/src/components/features/pwa/install-prompt-banner/`)
- `use-pwa-install-decision.ts` + `use-install-prompt-banner-store.ts`: capture `beforeinstallprompt`, check `display-mode: standalone`
  (originally `use-install-prompt.ts` under the old `sections/pwa/` tree)
- `install-prompt-banner.tsx`: gated on the consent Shared Store — only shows when cookie consent is ACCEPTED
  - Reasoning: prompt fires GA tracking events → inconsistent to show to users who rejected tracking
  - Eliminates banner overlap with cookie consent banner
- Uses `useGlassmorphism` + same layout as the design system's `organism/cookie-consent-banner/cookie-consent-banner.tsx` (identical CSS classes)
- `beforeinstallprompt` is Chromium-only — Safari/Firefox never see the prompt

### Background Sync (`apps/website/src/lib/background-sync/contact-queue.ts`)
- localStorage queue (key: `fabrizioduroni_contact_queue`)
- Cross-browser including Safari (SW Background Sync API not supported on Safari)
- The replay now lives in `use-layout-additional-content-store.ts` (an `online` listener calling `replayQueue`);
  originally a separate `useOfflineContactQueue` hook
- Contact form detects `navigator.onLine`, queues offline submissions

### `useConsentStore` (`apps/website/src/components/features/consent/use-consent-store.ts`)
A Shared Store hook following the `useMotionStore` pattern exactly (it began in the design system's hooks and moved
to the Website, since consent is application state):
- `useSyncExternalStore` subscribing to `consentChangeEvent` from `apps/website/src/lib/consents/consents.ts`
- `writeConsent` dispatches `consentChangeEvent` (camelCase, matching `motionChangeEvent`)
- `getServerSnapshot` returns `false` (no consent on server)
- Reusable for any component that needs to react to consent changes

## Known Issues / Debugging History

### Bad exercise slug (fixed)
`apps/website/src/content/data-structures-and-algorithms/topic/tries/exercise/maximum-XOR-of-two-numbers-in-an -array` had a literal space in the directory name → URL with `%20` → `bad-precaching-response` SW install failure. Renamed to `maximum-xor-of-two-numbers-in-an-array`.

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
