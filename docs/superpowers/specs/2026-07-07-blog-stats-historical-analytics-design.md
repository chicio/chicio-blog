# Blog Stats — Merge Pre-2022 Universal Analytics History into All-Time Traffic

Date: 2026-07-07
Status: Approved (brainstorm gate)
Builds on: PR #448 (`/blog/stats` content stats) + the live GA4 analytics section
(`2026-07-07-blog-stats-ga-analytics-design.md`)
Route affected: `/blog/stats`

## Goal

The `/blog/stats` traffic section only covers the **GA4 era** (~2022→now) because the pre-2022
**Universal Analytics** property (`UA-97399890-1`) data was permanently deleted by Google in 2024. One
artifact survives: an archived **Google Data Studio "Audience Overview"** report screenshot covering
**May 2017 → May 2021**. This change captures those figures as a durable, typed dataset and **merges**
them with the live GA4 data so the page shows the blog's **full-history** traffic — totals plus new
**users-by-continent** and **users-by-device** breakdown charts inspired by the old report.

This directly retires the "Backfilling pre-GA4 (UA) history — not available" out-of-scope item from the
GA-analytics spec: the history *is* now available (as an estimate).

## Decisions locked (brainstorm)

- **Merge, don't separate.** Headline totals **sum** both eras into true lifetime numbers. New breakdown
  charts (continent, device) are **all-time**: UA snapshot counts + GA4 counts unioned by label.
- **Pre-2022 is an estimate, not exact.** Sourced from the archived report window (**2017-05 → 2021-05**).
  The site started 2015-08 and migrated ~2022, so ~1.75 years (2015–2017, 2021–2022) are **not** in the
  snapshot. We do **not** extrapolate the gap — use the report figures as-is and label the window
  honestly. No false precision.
- **Honesty caveat baked into the UI.** UA and GA4 count users/sessions differently (UA "users" ≠ GA4
  "active users"); page views are directly comparable, users/sessions are approximate when summed. A
  footnote states this. The "estimated" framing is explicit on the page.
- **Two breakdowns only:** by **continent** and by **device**. Language and new-vs-returning are dropped
  (roughest merges, lowest value).
- **Breakdown metric is Users**, not page views — the archived report's continent/device tables are in
  Users. GA4 breakdown queries therefore use `totalUsers` so both eras measure the same thing. Headline
  cards still sum pageViews / users / sessions.
- **One shared shape, pure merge.** Historical and GA4 sources both produce the same `DimensionCount[]`
  shape; merging is a pure, unit-tested union with no special-casing.
- **Persistent format: typed TS module.** `HISTORICAL_ANALYTICS` const `satisfies HistoricalAnalytics`
  — compile-time-checked against the shared interface, no runtime parsing, matches the repo's static-config
  convention (`src/types/configuration/*`). (JSON rejected: needs extra validation tooling for no gain.)
- **Continent = horizontal bar** (reuse the existing tag/author chart pattern). **Device = donut** — a
  new generic `donut-chart` design-system molecule (recharts `PieChart`), matching the old report's look.
- **Historical always renders.** Because the snapshot is static, the all-time overview (totals + continent
  + device) renders **even when GA4 credentials are absent** (stub mode); GA4 merely adds to it. This is
  an upgrade over today, where the whole analytics section disappears without creds.

## Data source (from the archived report, left panel: 2017-05 → 2021-05)

Provenance: the original Google Data Studio "Audience Overview" screenshot is preserved at
`docs/analytics/historical-2017-2022.jpeg` — the only surviving record of the pre-2022 UA data.


- **Totals:** page views `148,579`, users `77,736`, sessions `97,173`.
- **Users by continent:** Europe `27,036`, Americas `25,970`, Asia `21,208`, Oceania `1,628`,
  Africa `1,337`, `(not set)` `446`.
- **Users by device:** desktop `65,270`, mobile `15,169`, tablet `764`.

Note: dimension breakdowns need not sum to the users total — continent ≈ total; device sums higher
because a visitor using multiple devices across the 4-year window is counted per device. That's expected
for GA dimension reports and is fine for an all-time distribution chart. `(not set)` is kept and rendered
as `Unknown`.

## Architecture

### Types — `src/types/content/analytics-stats.ts` (extend)

```ts
export interface DimensionCount {
    label: string;   // "Europe", "Desktop"
    users: number;
}

// GA4-era stats — extend the existing interface with two dimensions
export interface AnalyticsStats {
    totals: AnalyticsTotals;
    viewsPerMonth: ViewsPerMonth[];
    topPosts: TopPost[];
    byContinent: DimensionCount[];   // NEW
    byDevice: DimensionCount[];      // NEW
    since: string;
}

// The pre-2022 static snapshot — same core shape + an honest window label
export interface HistoricalAnalytics {
    window: { start: string; end: string };  // "2017-05", "2021-05"
    totals: AnalyticsTotals;
    byContinent: DimensionCount[];
    byDevice: DimensionCount[];
}

// The merged all-time view model the overview renders
export interface AllTimeAnalytics {
    totals: AnalyticsTotals;
    byContinent: DimensionCount[];
    byDevice: DimensionCount[];
    historicalWindow: { start: string; end: string };
    hasGa4: boolean;   // did GA4 contribute? drives the "estimate only" vs "estimate + live" wording
}
```

### Data layer — `src/lib/blog-stats/` (lib leaf: npm + types only)

- **`historical-analytics.ts`** (new) — exports
  `export const HISTORICAL_ANALYTICS = { … } satisfies HistoricalAnalytics;` with the figures above.
  Pure data, no imports beyond the type. Hand-editable, git-diffable, tsc-checked.
- **`analytics.ts`** (extend) — add two `runReport` calls to `getAnalyticsStats()`, wrapped in the same
  try/catch fail-open:
  - **By continent** — dimension `continent`, metric `totalUsers`, ordered by users desc.
  - **By device** — dimension `deviceCategory`, metric `totalUsers`.
  - New pure mappers `mapDimensionCounts(rows)` → `DimensionCount[]` (unit-testable without the SDK);
    fold into `mapReportsToAnalyticsStats(...)` so its output includes `byContinent` / `byDevice`.
- **`merge-analytics.ts`** (new) — a pure function:
  `mergeAllTime(historical: HistoricalAnalytics, ga4: AnalyticsStats | null): AllTimeAnalytics`.
  - Sums `totals` field-by-field (GA4 null → historical totals only).
  - Unions `byContinent` / `byDevice` by `label` (case-insensitive), summing `users`; sorts desc.
  - Sets `hasGa4 = ga4 !== null`, `historicalWindow = historical.window`.
  - No network, no SDK — fully unit-testable.

### UI — design system

- **`src/components/design-system/molecules/chart/donut-chart/`** (new molecule) — generic, domain-free:
  props `data: { label: string; value: number }[]` + `colors?: string[]` (defaults to a Matrix-green
  palette). recharts `PieChart` + `Pie` (inner radius → donut) + shared `ChartTooltip`. Presentational
  (no local state → no store, like `chart-tooltip`). Folder-per-component: `donut-chart.tsx` + `index.ts`.
  Type-only imports only (design-system isolation rule).

### UI — `src/components/content/blog/blog-stats/` (page-local, folder-per-component)

Restructure the analytics area into two conceptual blocks:

- **All-time overview** (always renders — historical is static):
  - Totals `StatCard` row (page views / users / sessions) from `AllTimeAnalytics.totals`.
  - **`continent-chart/`** (new) — horizontal `BarChart`, same pattern as `tag-distribution-chart`
    (`labelPrefix="Continent: "`).
  - **`device-chart/`** (new) — wraps the new `DonutChart`; maps `DimensionCount → { label, value }` and
    passes Matrix-green shades.
  - Footnote caption: e.g. *"Totals include estimated Universal Analytics traffic (May 2017 – May 2021).
    Users and sessions are approximate — UA and GA4 count them differently."* Wording adapts on `hasGa4`.
- **GA4-era detail** (renders only when `ga4 !== null`): the existing `views-over-time-chart` +
  `top-posts-chart`, under a "Traffic since {since}" label (unchanged behavior).

`analytics-section.tsx` receives both `allTime: AllTimeAnalytics` and `ga4: AnalyticsStats | null`, renders
the overview unconditionally and the GA4-era detail conditionally. `blog-stats.tsx` passes them through.

### Route — `src/app/blog/stats/page.tsx`

- Still `async`, still statically prerendered (no `revalidate`).
- `const ga4 = await getAnalyticsStats();`
- `const allTime = mergeAllTime(HISTORICAL_ANALYTICS, ga4);`
- Pass `allTime` + `ga4` into `<BlogStats … />`. In stub mode (`ga4 === null`) the overview still shows the
  historical estimate.

## Testing

- **Unit (node):**
  - `historical-analytics` — the const `satisfies HistoricalAnalytics` (compile-time) + a smoke test that
    totals/breakdowns are the documented figures.
  - `merge-analytics.test.ts` — historical-only when `ga4 === null`; summed totals + unioned/sorted
    dimensions when both present; label union is case-insensitive.
  - `analytics.test.ts` — extend: `mapReportsToAnalyticsStats` fixture now includes continent/device rows →
    correct `byContinent` / `byDevice`; stub + fail-open paths still yield `null`.
- **Component (jsdom):**
  - `donut-chart` (design system) — renders slices/labels from a fixture (assert data-driven text, not SVG
    internals).
  - `continent-chart` / `device-chart` — render from fixtures.
  - `analytics-section` — renders the all-time overview with `ga4 === null` (historical-only, no over-time/
    top-posts) **and** with a GA4 fixture (both blocks). Footnote wording switches on `hasGa4`.
- **Coverage floor:** keep ≥ current thresholds; raise if the new pure `lib` functions lift it.

## Out of scope

- Language & new-vs-returning breakdowns.
- Extrapolating the 2015–2017 / 2021–2022 gaps.
- Historical figures in the **markdown** representation — the markdown route stays content-only for now
  (consistent with the GA-analytics spec); revisit later if wanted.
- A geographic map/choropleth (the old report's world map) — continent bar chart is the scoped form.

## Gates

lint · validate-architecture (new donut molecule must obey design-system isolation; historical data module
is a clean lib leaf) · knip (no unused exports) · typecheck (clean) · test:run · build (must succeed in
**stub mode** with no GA creds — `/blog/stats` renders the historical estimate).
