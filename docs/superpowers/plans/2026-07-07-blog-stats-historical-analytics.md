# Blog Stats — Pre-2022 UA History Merge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the archived pre-2022 Universal Analytics snapshot with live GA4 data so `/blog/stats` shows full-history traffic totals plus all-time users-by-continent and users-by-device charts.

**Architecture:** One shared `DimensionCount` shape that both a static `HISTORICAL_ANALYTICS` const and the extended GA4 query layer produce; a pure `mergeAllTime()` unions them into an `AllTimeAnalytics` view model; the page renders an always-present all-time overview (totals + continent bar + device donut) plus the existing GA4-era-only detail charts.

**Tech Stack:** Next.js 16 (App Router, static prerender), React 19, TypeScript 5 strict, recharts, Vitest + React Testing Library, `@google-analytics/data`.

## Global Constraints

- 4-space indentation; 120-char max line length; always braces on `if`.
- `@/` import alias (maps to `src/`); named exports only (no default exports for modules).
- No decorative/section-divider comments.
- Component-store model: a component `.tsx` calls at most its own one `use<Name>Store()` hook (`useGlassmorphism` exempt); presentational components with no state need no store. No functions in JSX props (`react/jsx-no-bind` at error).
- Folder-per-component: kebab-case folder == `.tsx` basename; `index.ts` barrel re-exports only the component + public prop types.
- Design-system isolation (dependency-cruiser at error): `design-system/**` may import npm + other `design-system/**` + `src/types/**` **type-only**. No runtime/value import from `src/types`, no import from `lib/`, `features/`, `content/`, `app/`.
- `lib/**` may import only npm + other `lib/**` + `src/types/**` (no components).
- Matrix theme colors only: primary `#00FF41`, secondary `#00CC33`, accent `#39FF14`. Never break green-on-black.
- Conventional commits with Gitmoji; scope `capabilities` (or `ux` for pure UI). End commit messages with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Verification gates (run per task where relevant): `npm run lint`, `npm run validate-architecture`, `npm run knip`, `npm run typecheck`, `npm run test:run`, `npm run build`. Build must succeed in **stub mode** (no GA creds) — `/blog/stats` renders the historical estimate.
- Data facts (from the archived Data Studio "Audience Overview", left panel 2017-05→2021-05): totals pageViews 148579 / users 77736 / sessions 97173; continent users Europe 27036, Americas 25970, Asia 21208, Oceania 1628, Africa 1337, Unknown 446; device users Desktop 65270, Mobile 15169, Tablet 764.

---

### Task 1: Shared types + static historical dataset

**Files:**
- Modify: `src/types/content/analytics-stats.ts` (add `DimensionCount`, `HistoricalAnalytics`, `AllTimeAnalytics`; do NOT touch `AnalyticsStats` yet)
- Create: `src/lib/blog-stats/historical-analytics.ts`
- Test: `src/lib/blog-stats/historical-analytics.test.ts`

**Interfaces:**
- Produces: `interface DimensionCount { label: string; users: number; }`; `interface HistoricalAnalytics { window: { start: string; end: string }; totals: AnalyticsTotals; byContinent: DimensionCount[]; byDevice: DimensionCount[]; }`; `interface AllTimeAnalytics { totals: AnalyticsTotals; byContinent: DimensionCount[]; byDevice: DimensionCount[]; historicalWindow: { start: string; end: string }; hasGa4: boolean; }`; `const HISTORICAL_ANALYTICS: HistoricalAnalytics`.
- `window.start` / `window.end` are **display-ready strings** ("May 2017" / "May 2021") — no month formatter needed.

- [ ] **Step 1: Add the shared types**

Append to `src/types/content/analytics-stats.ts` (keep the existing `AnalyticsTotals`, `ViewsPerMonth`, `TopPost`, `AnalyticsStats` exactly as-is for now):

```ts
export interface DimensionCount {
    label: string;
    users: number;
}

export interface HistoricalAnalytics {
    window: { start: string; end: string };
    totals: AnalyticsTotals;
    byContinent: DimensionCount[];
    byDevice: DimensionCount[];
}

export interface AllTimeAnalytics {
    totals: AnalyticsTotals;
    byContinent: DimensionCount[];
    byDevice: DimensionCount[];
    historicalWindow: { start: string; end: string };
    hasGa4: boolean;
}
```

- [ ] **Step 2: Write the failing test**

Create `src/lib/blog-stats/historical-analytics.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { HISTORICAL_ANALYTICS } from "./historical-analytics";

describe("HISTORICAL_ANALYTICS", () => {
    it("carries the archived Universal Analytics totals (2017-05 to 2021-05)", () => {
        expect(HISTORICAL_ANALYTICS.totals).toEqual({ pageViews: 148579, users: 77736, sessions: 97173 });
        expect(HISTORICAL_ANALYTICS.window).toEqual({ start: "May 2017", end: "May 2021" });
    });

    it("carries the continent breakdown in users", () => {
        expect(HISTORICAL_ANALYTICS.byContinent).toEqual([
            { label: "Europe", users: 27036 },
            { label: "Americas", users: 25970 },
            { label: "Asia", users: 21208 },
            { label: "Oceania", users: 1628 },
            { label: "Africa", users: 1337 },
            { label: "Unknown", users: 446 },
        ]);
    });

    it("carries the device breakdown in users", () => {
        expect(HISTORICAL_ANALYTICS.byDevice).toEqual([
            { label: "Desktop", users: 65270 },
            { label: "Mobile", users: 15169 },
            { label: "Tablet", users: 764 },
        ]);
    });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm run test:run -- src/lib/blog-stats/historical-analytics.test.ts`
Expected: FAIL — cannot resolve `./historical-analytics`.

- [ ] **Step 4: Create the historical dataset**

Create `src/lib/blog-stats/historical-analytics.ts`:

```ts
import type { HistoricalAnalytics } from "@/types/content/analytics-stats";

export const HISTORICAL_ANALYTICS: HistoricalAnalytics = {
    window: { start: "May 2017", end: "May 2021" },
    totals: { pageViews: 148579, users: 77736, sessions: 97173 },
    byContinent: [
        { label: "Europe", users: 27036 },
        { label: "Americas", users: 25970 },
        { label: "Asia", users: 21208 },
        { label: "Oceania", users: 1628 },
        { label: "Africa", users: 1337 },
        { label: "Unknown", users: 446 },
    ],
    byDevice: [
        { label: "Desktop", users: 65270 },
        { label: "Mobile", users: 15169 },
        { label: "Tablet", users: 764 },
    ],
};
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:run -- src/lib/blog-stats/historical-analytics.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Typecheck + commit**

Run: `npm run typecheck`
Expected: no errors.

```bash
git add src/types/content/analytics-stats.ts src/lib/blog-stats/historical-analytics.ts src/lib/blog-stats/historical-analytics.test.ts
git commit -m "feat(capabilities): :sparkles: add pre-2022 UA historical analytics dataset

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Extend the GA4 query layer with continent + device breakdowns

**Files:**
- Modify: `src/types/content/analytics-stats.ts` (add `byContinent` / `byDevice` to `AnalyticsStats`)
- Modify: `src/lib/blog-stats/analytics.ts`
- Modify: `src/lib/blog-stats/analytics.test.ts`

**Interfaces:**
- Consumes: `DimensionCount` (Task 1).
- Produces: extended `AnalyticsStats` with `byContinent: DimensionCount[]` and `byDevice: DimensionCount[]`; new exported `mapDimensionCounts(rows, normalize?)`; extended `mapReportsToAnalyticsStats(totalsRows, viewsPerMonthRows, topPostsRows, continentRows, deviceRows, resolveTitle)`.

- [ ] **Step 1: Extend the `AnalyticsStats` type**

In `src/types/content/analytics-stats.ts`, add the two fields to `AnalyticsStats`:

```ts
export interface AnalyticsStats {
    totals: AnalyticsTotals;
    viewsPerMonth: ViewsPerMonth[];
    topPosts: TopPost[];
    byContinent: DimensionCount[];
    byDevice: DimensionCount[];
    since: string;
}
```

- [ ] **Step 2: Update the failing tests**

In `src/lib/blog-stats/analytics.test.ts`, update the two `mapReportsToAnalyticsStats` cases and add a `mapDimensionCounts` block. Replace the whole `describe("mapReportsToAnalyticsStats", ...)` block with:

```ts
    describe("mapDimensionCounts", () => {
        it("maps dimension rows to label/users pairs, dropping empty labels", () => {
            const rows = [
                { dimensionValues: [{ value: "Europe" }], metricValues: [{ value: "27036" }] },
                { dimensionValues: [{ value: "" }], metricValues: [{ value: "5" }] },
            ];

            expect(mapDimensionCounts(rows)).toEqual([{ label: "Europe", users: 27036 }]);
        });

        it("applies the optional label normalizer", () => {
            const rows = [{ dimensionValues: [{ value: "(not set)" }], metricValues: [{ value: "12" }] }];
            const normalize = (label: string) => (label === "(not set)" ? "Unknown" : label);

            expect(mapDimensionCounts(rows, normalize)).toEqual([{ label: "Unknown", users: 12 }]);
        });
    });

    describe("mapReportsToAnalyticsStats", () => {
        it("wires totals, views-per-month, top posts, and dimension breakdowns from raw GA rows", () => {
            const totalsRows = [{ metricValues: [{ value: "1000" }, { value: "800" }, { value: "900" }] }];
            const viewsPerMonthRows = [
                { dimensionValues: [{ value: "202403" }], metricValues: [{ value: "50" }] },
                { dimensionValues: [{ value: "202401" }], metricValues: [{ value: "100" }] },
            ];
            const topPostsRows = [
                { dimensionValues: [{ value: "/blog/post/2024/01/01/my-post" }], metricValues: [{ value: "42" }] },
            ];
            const continentRows = [
                { dimensionValues: [{ value: "Europe" }], metricValues: [{ value: "10" }] },
                { dimensionValues: [{ value: "(not set)" }], metricValues: [{ value: "2" }] },
            ];
            const deviceRows = [{ dimensionValues: [{ value: "desktop" }], metricValues: [{ value: "7" }] }];
            const resolveTitle = (path: string) => (path.endsWith("my-post") ? "My Post" : path);

            expect(
                mapReportsToAnalyticsStats(
                    totalsRows,
                    viewsPerMonthRows,
                    topPostsRows,
                    continentRows,
                    deviceRows,
                    resolveTitle,
                ),
            ).toEqual({
                totals: { pageViews: 1000, users: 800, sessions: 900 },
                viewsPerMonth: [
                    { month: "202401", views: 100 },
                    { month: "202403", views: 50 },
                ],
                topPosts: [{ path: "/blog/post/2024/01/01/my-post", title: "My Post", views: 42 }],
                byContinent: [
                    { label: "Europe", users: 10 },
                    { label: "Unknown", users: 2 },
                ],
                byDevice: [{ label: "desktop", users: 7 }],
                since: "202401",
            });
        });

        it("returns zeroed totals, empty arrays, and an empty since when every report is empty", () => {
            expect(mapReportsToAnalyticsStats(null, null, null, null, null, (path) => path)).toEqual({
                totals: { pageViews: 0, users: 0, sessions: 0 },
                viewsPerMonth: [],
                topPosts: [],
                byContinent: [],
                byDevice: [],
                since: "",
            });
        });
    });
```

Also update the import line at the top of the file to include `mapDimensionCounts`:

```ts
import {
    getAnalyticsStats,
    mapDimensionCounts,
    mapReportsToAnalyticsStats,
    mapTopPosts,
    mapTotals,
    mapViewsPerMonth,
} from "./analytics";
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm run test:run -- src/lib/blog-stats/analytics.test.ts`
Expected: FAIL — `mapDimensionCounts` not exported / arity mismatch on `mapReportsToAnalyticsStats`.

- [ ] **Step 4: Implement the mapper + extra reports**

In `src/lib/blog-stats/analytics.ts`:

Add `DimensionCount` to the type import:

```ts
import { AnalyticsStats, AnalyticsTotals, DimensionCount, TopPost, ViewsPerMonth } from "@/types/content/analytics-stats";
```

Add the constant near the other constants:

```ts
const CONTINENT_UNKNOWN_RAW = "(not set)";
```

Add the mapper (after `mapTopPosts`):

```ts
export const mapDimensionCounts = (
    rows: AnalyticsRow[] | null | undefined,
    normalize: (label: string) => string = (label) => label,
): DimensionCount[] =>
    (rows ?? [])
        .map((row) => ({
            label: normalize(row.dimensionValues?.[0]?.value ?? ""),
            users: parseMetricValue(row, 0),
        }))
        .filter((entry) => entry.label !== "");
```

Extend `mapReportsToAnalyticsStats` signature + body:

```ts
export const mapReportsToAnalyticsStats = (
    totalsRows: AnalyticsRow[] | null | undefined,
    viewsPerMonthRows: AnalyticsRow[] | null | undefined,
    topPostsRows: AnalyticsRow[] | null | undefined,
    continentRows: AnalyticsRow[] | null | undefined,
    deviceRows: AnalyticsRow[] | null | undefined,
    resolveTitle: (path: string) => string,
): AnalyticsStats => {
    const viewsPerMonth = mapViewsPerMonth(viewsPerMonthRows);

    return {
        totals: mapTotals(totalsRows),
        viewsPerMonth,
        topPosts: mapTopPosts(topPostsRows, resolveTitle),
        byContinent: mapDimensionCounts(continentRows, (label) =>
            label === CONTINENT_UNKNOWN_RAW ? "Unknown" : label,
        ),
        byDevice: mapDimensionCounts(deviceRows),
        since: viewsPerMonth[0]?.month ?? "",
    };
};
```

In `getAnalyticsStats`, add two reports after the `topPostsResponse` block (before the `return`), then pass them in:

```ts
        const [continentResponse] = await client.runReport({
            property,
            dateRanges,
            dimensions: [{ name: "continent" }],
            metrics: [{ name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
        });

        const [deviceResponse] = await client.runReport({
            property,
            dateRanges,
            dimensions: [{ name: "deviceCategory" }],
            metrics: [{ name: "totalUsers" }],
            orderBys: [{ metric: { metricName: "totalUsers" }, desc: true }],
        });

        return mapReportsToAnalyticsStats(
            totalsResponse.rows,
            viewsPerMonthResponse.rows,
            topPostsResponse.rows,
            continentResponse.rows,
            deviceResponse.rows,
            buildPostTitleResolver(),
        );
```

- [ ] **Step 5: Run tests + typecheck**

Run: `npm run test:run -- src/lib/blog-stats/analytics.test.ts`
Expected: PASS. Then `npm run typecheck` — no errors.

Note: the existing `analytics-section.test.tsx` fixture will now fail typecheck (missing `byContinent` / `byDevice`) — that is expected and fixed in Task 6. If running the full suite here, this file may error; scope test runs to the analytics files in this task.

- [ ] **Step 6: Commit**

```bash
git add src/types/content/analytics-stats.ts src/lib/blog-stats/analytics.ts src/lib/blog-stats/analytics.test.ts
git commit -m "feat(capabilities): :sparkles: query GA4 continent + device breakdowns

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Pure `mergeAllTime` combiner

**Files:**
- Create: `src/lib/blog-stats/merge-analytics.ts`
- Test: `src/lib/blog-stats/merge-analytics.test.ts`

**Interfaces:**
- Consumes: `HistoricalAnalytics`, `AnalyticsStats`, `DimensionCount`, `AllTimeAnalytics`, `AnalyticsTotals` (Tasks 1–2).
- Produces: `mergeAllTime(historical: HistoricalAnalytics, ga4: AnalyticsStats | null): AllTimeAnalytics`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/blog-stats/merge-analytics.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { mergeAllTime } from "./merge-analytics";
import type { AnalyticsStats, HistoricalAnalytics } from "@/types/content/analytics-stats";

const historical: HistoricalAnalytics = {
    window: { start: "May 2017", end: "May 2021" },
    totals: { pageViews: 100, users: 80, sessions: 90 },
    byContinent: [
        { label: "Europe", users: 50 },
        { label: "Americas", users: 30 },
    ],
    byDevice: [
        { label: "Desktop", users: 60 },
        { label: "Mobile", users: 20 },
    ],
};

const ga4: AnalyticsStats = {
    totals: { pageViews: 10, users: 8, sessions: 9 },
    viewsPerMonth: [{ month: "202401", views: 10 }],
    topPosts: [],
    byContinent: [
        { label: "Europe", users: 5 },
        { label: "Asia", users: 7 },
    ],
    byDevice: [{ label: "desktop", users: 3 }],
    since: "202401",
};

describe("mergeAllTime", () => {
    it("returns the historical estimate alone when GA4 is absent (stub mode)", () => {
        const result = mergeAllTime(historical, null);

        expect(result.totals).toEqual({ pageViews: 100, users: 80, sessions: 90 });
        expect(result.byContinent).toEqual([
            { label: "Europe", users: 50 },
            { label: "Americas", users: 30 },
        ]);
        expect(result.hasGa4).toBe(false);
        expect(result.historicalWindow).toEqual({ start: "May 2017", end: "May 2021" });
    });

    it("sums totals across both eras", () => {
        expect(mergeAllTime(historical, ga4).totals).toEqual({ pageViews: 110, users: 88, sessions: 99 });
    });

    it("unions dimensions by case-insensitive label, keeping the historical label, sorted desc", () => {
        const result = mergeAllTime(historical, ga4);

        expect(result.byContinent).toEqual([
            { label: "Europe", users: 55 },
            { label: "Americas", users: 30 },
            { label: "Asia", users: 7 },
        ]);
        expect(result.byDevice).toEqual([
            { label: "Desktop", users: 63 },
            { label: "Mobile", users: 20 },
        ]);
        expect(result.hasGa4).toBe(true);
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/lib/blog-stats/merge-analytics.test.ts`
Expected: FAIL — cannot resolve `./merge-analytics`.

- [ ] **Step 3: Implement `mergeAllTime`**

Create `src/lib/blog-stats/merge-analytics.ts`:

```ts
import type {
    AllTimeAnalytics,
    AnalyticsStats,
    AnalyticsTotals,
    DimensionCount,
    HistoricalAnalytics,
} from "@/types/content/analytics-stats";

const sumTotals = (a: AnalyticsTotals, b: AnalyticsTotals): AnalyticsTotals => ({
    pageViews: a.pageViews + b.pageViews,
    users: a.users + b.users,
    sessions: a.sessions + b.sessions,
});

const mergeDimensions = (historical: DimensionCount[], ga4: DimensionCount[]): DimensionCount[] => {
    const byKey = new Map<string, DimensionCount>();

    [...historical, ...ga4].forEach((entry) => {
        const key = entry.label.trim().toLowerCase();
        const existing = byKey.get(key);

        if (existing) {
            existing.users += entry.users;
        } else {
            byKey.set(key, { label: entry.label, users: entry.users });
        }
    });

    return [...byKey.values()].sort((a, b) => b.users - a.users);
};

const NO_TOTALS: AnalyticsTotals = { pageViews: 0, users: 0, sessions: 0 };

export const mergeAllTime = (historical: HistoricalAnalytics, ga4: AnalyticsStats | null): AllTimeAnalytics => ({
    totals: sumTotals(historical.totals, ga4?.totals ?? NO_TOTALS),
    byContinent: mergeDimensions(historical.byContinent, ga4?.byContinent ?? []),
    byDevice: mergeDimensions(historical.byDevice, ga4?.byDevice ?? []),
    historicalWindow: historical.window,
    hasGa4: ga4 !== null,
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/lib/blog-stats/merge-analytics.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Typecheck + commit**

Run: `npm run typecheck` — no errors.

```bash
git add src/lib/blog-stats/merge-analytics.ts src/lib/blog-stats/merge-analytics.test.ts
git commit -m "feat(capabilities): :sparkles: add pure mergeAllTime analytics combiner

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: `DonutChart` design-system molecule

**Files:**
- Create: `src/components/design-system/molecules/chart/donut-chart/donut-chart.tsx`
- Create: `src/components/design-system/molecules/chart/donut-chart/index.ts`
- Test: `src/components/design-system/molecules/chart/donut-chart/donut-chart.test.tsx`

**Interfaces:**
- Consumes: `ChartTooltip` (existing molecule, same `chart/` group).
- Produces: `DonutChart` component with props `{ data: DonutDatum[]; colors?: string[] }`; `interface DonutDatum { label: string; value: number }`. Domain-free (no analytics types).

- [ ] **Step 1: Write the failing test**

Create `src/components/design-system/molecules/chart/donut-chart/donut-chart.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DonutChart } from "./index";

describe("DonutChart", () => {
    describe("render", () => {
        it("renders the recharts responsive container for the given data", () => {
            const { container } = render(
                <DonutChart
                    data={[
                        { label: "Desktop", value: 60 },
                        { label: "Mobile", value: 30 },
                    ]}
                />,
            );

            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });

        it("renders without crashing when data is empty", () => {
            const { container } = render(<DonutChart data={[]} />);
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/components/design-system/molecules/chart/donut-chart/donut-chart.test.tsx`
Expected: FAIL — cannot resolve `./index`.

- [ ] **Step 3: Implement the molecule**

Create `src/components/design-system/molecules/chart/donut-chart/donut-chart.tsx`:

```tsx
"use client";

import { FC } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";

export interface DonutDatum {
    label: string;
    value: number;
}

interface DonutChartProps {
    data: DonutDatum[];
    colors?: string[];
}

const DEFAULT_COLORS = ["#00FF41", "#00CC33", "#39FF14"];

export const DonutChart: FC<DonutChartProps> = ({ data, colors = DEFAULT_COLORS }) => (
    <div className="glow-container h-100 w-full p-5 mb-6">
        <ResponsiveContainer
            width={"100%"}
            height={"100%"}
            initialDimension={{ width: 320, height: 300 }}
        >
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={"55%"}
                    outerRadius={"80%"}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={entry.label}
                            fill={colors[index % colors.length]}
                        />
                    ))}
                </Pie>
                <Tooltip content={<ChartTooltip labelPrefix={""} />} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    </div>
);
```

Create `src/components/design-system/molecules/chart/donut-chart/index.ts`:

```ts
export { DonutChart } from "./donut-chart";
export type { DonutDatum } from "./donut-chart";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/components/design-system/molecules/chart/donut-chart/donut-chart.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Lint + architecture + commit**

Run: `npm run lint` and `npm run validate-architecture` — zero violations (donut imports only recharts + the sibling `chart-tooltip` barrel; no `src/types` value import).

```bash
git add src/components/design-system/molecules/chart/donut-chart/
git commit -m "feat(ux): :sparkles: add DonutChart design-system molecule

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: `continent-chart` + `device-chart` page components

**Files:**
- Create: `src/components/content/blog/blog-stats/analytics-section/continent-chart/continent-chart.tsx`
- Create: `src/components/content/blog/blog-stats/analytics-section/continent-chart/index.ts`
- Test: `src/components/content/blog/blog-stats/analytics-section/continent-chart/continent-chart.test.tsx`
- Create: `src/components/content/blog/blog-stats/analytics-section/device-chart/device-chart.tsx`
- Create: `src/components/content/blog/blog-stats/analytics-section/device-chart/index.ts`
- Test: `src/components/content/blog/blog-stats/analytics-section/device-chart/device-chart.test.tsx`

**Interfaces:**
- Consumes: `DimensionCount` (type), `DonutChart` + `DonutDatum` (Task 4), `ChartTooltip`.
- Produces: `ContinentChart` (`{ data: DimensionCount[] }`), `DeviceChart` (`{ data: DimensionCount[] }`).

- [ ] **Step 1: Write the failing tests**

Create `src/components/content/blog/blog-stats/analytics-section/continent-chart/continent-chart.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ContinentChart } from "./index";

describe("ContinentChart", () => {
    describe("render", () => {
        it("renders the recharts responsive container", () => {
            const { container } = render(
                <ContinentChart
                    data={[
                        { label: "Europe", users: 50 },
                        { label: "Americas", users: 30 },
                    ]}
                />,
            );

            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });
    });
});
```

Create `src/components/content/blog/blog-stats/analytics-section/device-chart/device-chart.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DeviceChart } from "./index";

describe("DeviceChart", () => {
    describe("render", () => {
        it("renders the recharts responsive container", () => {
            const { container } = render(
                <DeviceChart
                    data={[
                        { label: "Desktop", users: 60 },
                        { label: "Mobile", users: 30 },
                    ]}
                />,
            );

            expect(container.querySelector(".recharts-responsive-container")).toBeInTheDocument();
        });
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test:run -- src/components/content/blog/blog-stats/analytics-section/continent-chart src/components/content/blog/blog-stats/analytics-section/device-chart`
Expected: FAIL — cannot resolve `./index` for both.

- [ ] **Step 3: Implement the continent chart**

Create `src/components/content/blog/blog-stats/analytics-section/continent-chart/continent-chart.tsx` (mirrors `tag-distribution-chart`):

```tsx
"use client";

import { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/design-system/molecules/chart/chart-tooltip";
import type { DimensionCount } from "@/types/content/analytics-stats";

interface ContinentChartProps {
    data: DimensionCount[];
}

const MIN_CHART_HEIGHT = 300;
const ROW_HEIGHT = 40;
const CATEGORY_AXIS_WIDTH = 120;

export const ContinentChart: FC<ContinentChartProps> = ({ data }) => {
    const chartHeight = Math.max(MIN_CHART_HEIGHT, data.length * ROW_HEIGHT);

    return (
        <div
            className="glow-container w-full p-5 mb-6"
            style={{ height: chartHeight }}
        >
            <ResponsiveContainer
                width={"100%"}
                height={"100%"}
                initialDimension={{ width: 320, height: chartHeight }}
            >
                <BarChart
                    data={data}
                    layout="vertical"
                >
                    <XAxis
                        type="number"
                        allowDecimals={false}
                    />
                    <YAxis
                        dataKey="label"
                        type="category"
                        width={CATEGORY_AXIS_WIDTH}
                    />
                    <Tooltip content={<ChartTooltip labelPrefix="Continent: " />} />
                    <Bar
                        dataKey="users"
                        name="Users"
                        fill="#00CC33"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
```

Create `src/components/content/blog/blog-stats/analytics-section/continent-chart/index.ts`:

```ts
export { ContinentChart } from "./continent-chart";
```

- [ ] **Step 4: Implement the device chart**

Create `src/components/content/blog/blog-stats/analytics-section/device-chart/device-chart.tsx` (maps to the donut molecule; mapping done in the body, not in JSX, to respect `jsx-no-bind`):

```tsx
"use client";

import { FC } from "react";
import { DonutChart } from "@/components/design-system/molecules/chart/donut-chart";
import type { DimensionCount } from "@/types/content/analytics-stats";

interface DeviceChartProps {
    data: DimensionCount[];
}

export const DeviceChart: FC<DeviceChartProps> = ({ data }) => {
    const donutData = data.map((entry) => ({ label: entry.label, value: entry.users }));

    return <DonutChart data={donutData} />;
};
```

Create `src/components/content/blog/blog-stats/analytics-section/device-chart/index.ts`:

```ts
export { DeviceChart } from "./device-chart";
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm run test:run -- src/components/content/blog/blog-stats/analytics-section/continent-chart src/components/content/blog/blog-stats/analytics-section/device-chart`
Expected: PASS (2 tests).

- [ ] **Step 6: Lint + architecture + commit**

Run: `npm run lint` and `npm run validate-architecture` — zero violations.

```bash
git add src/components/content/blog/blog-stats/analytics-section/continent-chart/ src/components/content/blog/blog-stats/analytics-section/device-chart/
git commit -m "feat(ux): :sparkles: add all-time continent + device breakdown charts

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Restructure `analytics-section` + thread `allTime` through the page

**Files:**
- Modify: `src/components/content/blog/blog-stats/analytics-section/analytics-section.tsx`
- Modify: `src/components/content/blog/blog-stats/analytics-section/analytics-section.test.tsx`
- Modify: `src/components/content/blog/blog-stats/blog-stats.tsx`
- Modify: `src/app/blog/stats/page.tsx`

**Interfaces:**
- Consumes: `AllTimeAnalytics`, `AnalyticsStats` (types), `mergeAllTime` (Task 3), `HISTORICAL_ANALYTICS` (Task 1), `ContinentChart` / `DeviceChart` (Task 5), existing `ViewsOverTimeChart` / `TopPostsChart` / `StatCard` / `formatAnalyticsMonth`.
- Produces: `AnalyticsSection` with props `{ allTime: AllTimeAnalytics; ga4: AnalyticsStats | null }`; `BlogStats` gains `allTime` prop.

- [ ] **Step 1: Update the failing test**

Replace `src/components/content/blog/blog-stats/analytics-section/analytics-section.test.tsx` with:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnalyticsSection } from "./index";
import type { AllTimeAnalytics, AnalyticsStats } from "@/types/content/analytics-stats";

const allTime: AllTimeAnalytics = {
    totals: { pageViews: 12345, users: 6789, sessions: 8000 },
    byContinent: [
        { label: "Europe", users: 4000 },
        { label: "Americas", users: 2000 },
    ],
    byDevice: [
        { label: "Desktop", users: 5000 },
        { label: "Mobile", users: 1500 },
    ],
    historicalWindow: { start: "May 2017", end: "May 2021" },
    hasGa4: true,
};

const ga4: AnalyticsStats = {
    totals: { pageViews: 2345, users: 789, sessions: 900 },
    viewsPerMonth: [
        { month: "202401", views: 500 },
        { month: "202402", views: 700 },
    ],
    topPosts: [{ path: "/blog/post/2024/01/01/my-post", title: "My Post", views: 300 }],
    byContinent: [{ label: "Europe", users: 100 }],
    byDevice: [{ label: "desktop", users: 80 }],
    since: "202401",
};

describe("AnalyticsSection", () => {
    describe("render", () => {
        it("renders the all-time totals even when GA4 is absent (stub mode)", () => {
            render(
                <AnalyticsSection
                    allTime={{ ...allTime, hasGa4: false }}
                    ga4={null}
                />,
            );

            expect(screen.getByText("Page views").previousElementSibling).toHaveTextContent("12,345");
            expect(screen.getByText("Users").previousElementSibling).toHaveTextContent("6,789");
            expect(screen.getByText("Sessions").previousElementSibling).toHaveTextContent("8,000");
        });

        it("renders the all-time breakdown headings", () => {
            render(
                <AnalyticsSection
                    allTime={allTime}
                    ga4={ga4}
                />,
            );

            expect(screen.getByRole("heading", { level: 2, name: "Traffic (all time)" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 2, name: "Users by continent" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 2, name: "Users by device" })).toBeInTheDocument();
        });

        it("hides the GA4-era detail charts when GA4 is absent", () => {
            render(
                <AnalyticsSection
                    allTime={{ ...allTime, hasGa4: false }}
                    ga4={null}
                />,
            );

            expect(screen.queryByRole("heading", { level: 2, name: "Views over time" })).not.toBeInTheDocument();
            expect(screen.queryByRole("heading", { level: 2, name: "Top posts by views" })).not.toBeInTheDocument();
        });

        it("shows the GA4-era detail charts and since-caption when GA4 is present", () => {
            render(
                <AnalyticsSection
                    allTime={allTime}
                    ga4={ga4}
                />,
            );

            expect(screen.getByRole("heading", { level: 2, name: "Views over time" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { level: 2, name: "Top posts by views" })).toBeInTheDocument();
            expect(screen.getByText("Live traffic since January 2024.")).toBeInTheDocument();
        });

        it("notes the estimate is UA-only when GA4 is absent", () => {
            render(
                <AnalyticsSection
                    allTime={{ ...allTime, hasGa4: false }}
                    ga4={null}
                />,
            );

            expect(screen.getByText(/estimated from Universal Analytics \(May 2017 – May 2021\)/)).toBeInTheDocument();
        });

        it("notes totals combine both eras when GA4 is present", () => {
            render(
                <AnalyticsSection
                    allTime={allTime}
                    ga4={ga4}
                />,
            );

            expect(screen.getByText(/combine live GA4 data with estimated Universal Analytics/)).toBeInTheDocument();
        });
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/components/content/blog/blog-stats/analytics-section/analytics-section.test.tsx`
Expected: FAIL — prop shape changed / headings not found.

- [ ] **Step 3: Rewrite `analytics-section.tsx`**

Replace `src/components/content/blog/blog-stats/analytics-section/analytics-section.tsx` with:

```tsx
"use client";

import { FC } from "react";
import { StatCard } from "@/components/design-system/molecules/stat-card";
import { formatAnalyticsMonth } from "@/lib/blog-stats/format-month";
import type { AllTimeAnalytics, AnalyticsStats } from "@/types/content/analytics-stats";
import { ContinentChart } from "./continent-chart";
import { DeviceChart } from "./device-chart";
import { ViewsOverTimeChart } from "./views-over-time-chart";
import { TopPostsChart } from "./top-posts-chart";

interface AnalyticsSectionProps {
    allTime: AllTimeAnalytics;
    ga4: AnalyticsStats | null;
}

export const AnalyticsSection: FC<AnalyticsSectionProps> = ({ allTime, ga4 }) => {
    const { totals, byContinent, byDevice, historicalWindow, hasGa4 } = allTime;
    const estimateNote = hasGa4
        ? `Totals combine live GA4 data with estimated Universal Analytics traffic (${historicalWindow.start} – ${historicalWindow.end}). Users and sessions are approximate — Universal Analytics and GA4 count them differently.`
        : `Totals are estimated from Universal Analytics (${historicalWindow.start} – ${historicalWindow.end}); live analytics is not configured yet.`;
    const sinceLabel = ga4 && ga4.since !== "" ? formatAnalyticsMonth(ga4.since) : "";

    return (
        <>
            <h2 className="mt-10 mb-1">Traffic (all time)</h2>
            <p className="text-secondary mb-4 text-sm">{estimateNote}</p>
            <div className="mt-6 mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                <StatCard
                    value={totals.pageViews.toLocaleString("en-US")}
                    label="Page views"
                />
                <StatCard
                    value={totals.users.toLocaleString("en-US")}
                    label="Users"
                />
                <StatCard
                    value={totals.sessions.toLocaleString("en-US")}
                    label="Sessions"
                />
            </div>
            <h2 className="mt-10 mb-4">Users by continent</h2>
            <ContinentChart data={byContinent} />
            <h2 className="mt-10 mb-4">Users by device</h2>
            <DeviceChart data={byDevice} />
            {ga4 && (
                <>
                    {sinceLabel !== "" && (
                        <p className="text-secondary mt-10 mb-4 text-sm">Live traffic since {sinceLabel}.</p>
                    )}
                    <h2 className="mt-10 mb-4">Views over time</h2>
                    <ViewsOverTimeChart data={ga4.viewsPerMonth} />
                    <h2 className="mt-10 mb-4">Top posts by views</h2>
                    <TopPostsChart data={ga4.topPosts} />
                </>
            )}
        </>
    );
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/components/content/blog/blog-stats/analytics-section/analytics-section.test.tsx`
Expected: PASS (6 tests).

- [ ] **Step 5: Update `blog-stats.tsx` to pass `allTime` + `ga4`**

In `src/components/content/blog/blog-stats/blog-stats.tsx`:

Update the type import + props:

```tsx
import type { AllTimeAnalytics, AnalyticsStats } from "@/types/content/analytics-stats";
```

```tsx
interface BlogStatsProps {
    author: string;
    stats: BlogStatsData;
    allTime: AllTimeAnalytics;
    analytics: AnalyticsStats | null;
}

export const BlogStats: FC<BlogStatsProps> = ({ author, stats, allTime, analytics }) => {
```

And update the `AnalyticsSection` usage near the bottom:

```tsx
                    <AnalyticsSection
                        allTime={allTime}
                        ga4={analytics}
                    />
```

- [ ] **Step 6: Update `page.tsx` to compute the merge**

In `src/app/blog/stats/page.tsx`, add imports:

```ts
import { mergeAllTime } from "@/lib/blog-stats/merge-analytics";
import { HISTORICAL_ANALYTICS } from "@/lib/blog-stats/historical-analytics";
```

Update the component body:

```tsx
export default async function Stats() {
    const stats = getBlogStats();
    const analytics = await getAnalyticsStats();
    const allTime = mergeAllTime(HISTORICAL_ANALYTICS, analytics);
    const author = siteMetadata.author;

    return (
        <BlogStats
            author={author}
            stats={stats}
            allTime={allTime}
            analytics={analytics}
        />
    );
}
```

- [ ] **Step 7: Full verification**

Run in order — all must pass:

```
npm run lint
npm run validate-architecture
npm run knip
npm run typecheck
npm run test:run
npm run build
```

Expected: all green; `/blog/stats` prerenders (`○`) in stub mode showing the historical estimate (Page views 148,579 etc.), and, if GA creds are present, the summed totals + merged continent/device charts + GA4-era over-time/top-posts.

- [ ] **Step 8: Commit**

```bash
git add src/components/content/blog/blog-stats/analytics-section/analytics-section.tsx src/components/content/blog/blog-stats/analytics-section/analytics-section.test.tsx src/components/content/blog/blog-stats/blog-stats.tsx src/app/blog/stats/page.tsx
git commit -m "feat(capabilities): :sparkles: merge pre-2022 UA history into all-time traffic view

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Notes for the implementer

- **Manual QA:** run `npm run dev`, open `http://localhost:3000/blog/stats`. In stub mode (no GA creds) you should see the "Traffic (all time)" section with the historical estimate, the continent bar, and the device donut — and NO "Views over time"/"Top posts" (those need GA4). Confirm the footnote reads the UA-only wording.
- **Out of scope (do not add):** language / new-vs-returning breakdowns; extrapolating the 2015–2017 / 2021–2022 gaps; historical figures in the markdown representation (route stays content-only); a geographic map.
- **`(not set)` → `Unknown`:** the GA4 continent mapper normalizes `(not set)` so it merges with the historical `Unknown` bucket. Device labels from GA4 are lowercase (`desktop`) and merge case-insensitively into the historical `Desktop` label.
```
