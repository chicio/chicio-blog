# Blog Stats — Live GA Analytics Section (stubbed, ISR)

Date: 2026-07-07
Status: Approved (brainstorm gate)
Stacked on: PR #448 (`worktree-feat+blog-stats-page`) — branch `feat/blog-stats-ga`
Route affected: `/blog/stats`

## Goal

Add a **traffic-analytics section** to the existing `/blog/stats` page, sourced from the **GA4 Data
API**. Built now behind a **stub interface** so it ships dark and lights up the moment the credentials
exist — no rework. Rendering model: **build-time static** (fetched during `next build`, baked into the
static page) — the secret lives in the **build environment only** and never in the runtime server,
which is the most secure footprint. Freshness comes from a **daily scheduled rebuild**.

## Decisions locked (brainstorm)

- **Stub-first**: `getAnalyticsStats()` returns `null` when credentials are absent → the analytics
  section renders nothing; the content-stats page is unchanged. Returns real data when configured.
- **Build-time static (NOT ISR)**: `getBlogStats()` (sync, content) + `await getAnalyticsStats()` (GA)
  both run in the async server component **at build**. The page stays statically prerendered (`○`); no
  `revalidate`. The GA credential is therefore used only during `next build` and is **not required in
  the runtime environment** — smallest secret exposure surface (the decision driver).
- **Daily freshness via scheduled rebuild**: a GitHub Actions **scheduled workflow** (daily cron)
  triggers a **Vercel Deploy Hook**, redeploying the site so the baked-in numbers refresh without a
  content push. Ships dark: the workflow **no-ops** when the deploy-hook secret is absent.
- **Fail-open**: any GA API/auth error → log + return `null` (section hidden). GA problems must NEVER
  break the build or the page — a failed GA call at build produces the same output as stub mode.
- **Free**: GA4 Data API has no cost; one query per build (~daily) is trivially within quota.
- **Honest scope**: traffic data only covers the **GA4 era** (not the blog's full 10-year lifespan —
  UA history is gone). The UI labels the traffic section accordingly (e.g. "Traffic since <first GA4 month>").

## Credentials (provisioned later by the owner)

Env vars (all absent today → stub mode):
- `GA_PROPERTY_ID` — numeric GA4 property id behind measurement id `G-B992TEM300`.
- `GA_SA_CLIENT_EMAIL` — service-account email (added as Viewer on the property).
- `GA_SA_PRIVATE_KEY` — service-account private key (PEM; handle `\n` un-escaping).

`getAnalyticsStats()` is configured only when all three are present.

## Architecture

### Dependency

- Add **`@google-analytics/data`** (official Node client, `BetaAnalyticsDataClient`) to
  `dependencies`. It is imported by `src/lib/analytics/analytics.ts` (so knip sees it used). The client
  is only instantiated when creds are present.

### Data layer — `src/lib/analytics/` (lib leaf: npm + types only)

- `analytics-config.ts` — `readAnalyticsConfig(): AnalyticsConfig | null` — reads + validates the three
  env vars; returns `null` if any missing. Pure, unit-testable (inject `process.env` or a getter).
- `analytics.ts`:
  - `getAnalyticsStats(): Promise<AnalyticsStats | null>`:
    - `if (!config) return null;`
    - Instantiate `BetaAnalyticsDataClient` with `{ credentials: { client_email, private_key } }`.
    - Run reports (wrapped in try/catch → `null` on any error):
      - **Lifetime totals** — metrics `screenPageViews`, `totalUsers`, `sessions`, date range
        `startDate: "2015-01-01"` (GA clamps to property start) → `today`.
      - **Views over time** — dimension `yearMonth`, metric `screenPageViews`, ordered ascending.
      - **Top posts by views** — dimension `pagePath`, metric `screenPageViews`, `limit: 10`, filtered
        to blog-post paths (`/blog/post/...`); map pagePath → title where feasible (best-effort; else
        show the path).
    - Map raw rows into a typed `AnalyticsStats`.
  - A pure `mapReportsToAnalyticsStats(...)` helper so the row-mapping is unit-testable without the SDK.
- `analytics.test.ts` (node): stub path (no creds → `null`), fail-open (client throws → `null`), and
  `mapReportsToAnalyticsStats` over a fixture GA response → correct `AnalyticsStats`.

### Types — `src/types/`

- `AnalyticsStats` (`src/types/content/analytics-stats.ts`):
  ```
  interface AnalyticsTotals { pageViews: number; users: number; sessions: number; }
  interface ViewsPerMonth { month: string; views: number; }
  interface TopPost { path: string; title: string; views: number; }
  interface AnalyticsStats {
      totals: AnalyticsTotals;
      viewsPerMonth: ViewsPerMonth[];
      topPosts: TopPost[];
      since: string; // first GA4 month present, for the honest label
  }
  ```

### UI — `src/components/content/blog/blog-stats/` (page-local, folder-per-component)

- `analytics-section/` — wrapper that receives `analytics: AnalyticsStats | null` and renders nothing
  when `null` (the stub/dark state). When present, composes:
  - a row of `StatCard`s (page views, users, sessions) — reuse the shared design-system `StatCard`.
  - `views-over-time-chart/` — recharts `LineChart`, shared `ChartTooltip` (`labelPrefix="Month: "`).
  - `top-posts-chart/` — recharts horizontal `BarChart` (same pattern as tag/author charts) or a ranked
    list; long titles → horizontal bars.
- A short honest caption: "Traffic since {since}".
- `blog-stats.tsx` renders `<AnalyticsSection analytics={analytics} />` after the content sections.

### Route — `src/app/blog/stats/page.tsx`

- **No `revalidate`** — the page stays statically prerendered.
- Make the server component `async`; `const analytics = await getAnalyticsStats();` runs at build and
  passes into `<BlogStats stats={stats} analytics={analytics} />`.

### Scheduled rebuild — `.github/workflows/scheduled-rebuild.yml` (new)

- `on: schedule: - cron: "0 6 * * *"` (daily) + `workflow_dispatch` for manual trigger.
- A single step that triggers a redeploy **only if** the deploy-hook secret is present:
  ```
  HOOK="${{ secrets.VERCEL_DEPLOY_HOOK_URL }}"
  if [ -n "$HOOK" ]; then curl -fsS -X POST "$HOOK"; else echo "No VERCEL_DEPLOY_HOOK_URL set — skipping."; fi
  ```
- Ships dark: without the secret it logs-and-skips (never fails). Owner provisions later: create a
  Vercel Deploy Hook (Production) → add its URL as the `VERCEL_DEPLOY_HOOK_URL` GitHub Actions secret.
- The GA build secrets (`GA_PROPERTY_ID`, `GA_SA_CLIENT_EMAIL`, `GA_SA_PRIVATE_KEY`) live in the
  **Vercel build environment** (not GitHub, not runtime) so `next build` on Vercel can fetch GA.

### Markdown

- Keep `blogStatsMarkdown()` **content-only** for now (the markdown route is `force-static`; live GA
  doesn't belong in a statically-generated markdown snapshot). Document this; revisit if a build-time
  snapshot is wanted later.

## Testing

- **Unit (node):** `analytics-config.test.ts` (missing/complete env), `analytics.test.ts` (stub, fail-open,
  mapping). Mock `@google-analytics/data`.
- **Component (jsdom):** `analytics-section` renders `null`-safe (nothing when `analytics == null`) and
  renders totals + section headings with a fixture. Charts: assert data-driven text, not SVG internals.
- **No live E2E of GA** (no creds in CI; stub path is what CI exercises — page renders without the section).

## Rendering / ops

- `/blog/stats` stays **statically prerendered** (`○`). In CI and on Vercel with no GA creds it renders
  exactly as today (no analytics section) — so PR #448's behavior is preserved when this stacks on top.
- GA secret is used **only at build**, never in the runtime server; never shipped to the client bundle.
- Freshness: the daily `scheduled-rebuild` workflow redeploys → `next build` re-fetches GA → new static
  numbers. Between rebuilds the numbers are baked/frozen (acceptable for lifetime aggregates).

## Out of scope

- GA **Realtime** ("active readers now") widget — could be a later add.
- Backfilling pre-GA4 (UA) history — not available.
- Analytics in the markdown representation.

## Gates

lint · validate-architecture · knip (new dep must be *used*, not unlisted) · typecheck (clean) ·
test:run · build (must succeed in **stub mode** with no creds; `/blog/stats` renders without the section).
