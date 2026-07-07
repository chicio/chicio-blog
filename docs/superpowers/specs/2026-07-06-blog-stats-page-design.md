# Blog Stats Page — Design / Spec

Date: 2026-07-06
Status: Approved (Gate 1)
Route: `/blog/stats`

## Goal

A catchy, visually-rich **Stats** page reachable from the Blog dropdown menu, showing statistics
about the blog over its entire lifespan. Fully static, computed at build time from post frontmatter.
**No Google Analytics** — the existing `GOOGLE_ANALYTICS_API_SECRET` is a write-only Measurement
Protocol secret and cannot query analytics; live visitor/page-view data would require a new GA Data
API service-account credential, which is out of scope for this feature.

## Stats shown (all computable from frontmatter)

- **Headline counters** (hero row of stat cards): total posts, total words, total reading time
  (minutes/hours), years active, number of authors, number of tags.
- **Posts over time**: posts per year (bar chart).
- **Tag distribution**: top-N tags by post count (bar chart).
- **Per-author breakdown**: posts per author (bar chart).

## Architecture

### Data layer — `src/lib/blog-stats/` (pure, node-tested)

- `blog-stats.ts`:
  - `getBlogStats(): BlogStats` — orchestrator, built from `getPosts()` / `getTags()` /
    `getAuthorsWithPosts()` (all in `src/lib/content/posts/posts.ts`).
  - Pure helpers, each unit-tested:
    - `computeHeadlineTotals(posts)` → `{ totalPosts, totalWords, totalReadingMinutes, yearsActive, authorCount, tagCount }`
      - `totalWords` / `totalReadingMinutes` from each post's `readingTime` (`ReadTimeResults`: `.words`, `.minutes`).
      - `yearsActive` from min/max `frontmatter.date.year`.
    - `computePostsPerYear(posts)` → `{ year: number; count: number }[]` ascending by year, no gaps
      filled unless trivial (document behavior in test).
    - `computeTagDistribution(tags, limit)` → top-N `{ tag: string; count: number }[]` desc by count.
    - `computeAuthorDistribution(authorsWithPosts)` → `{ author: string; count: number }[]` desc by count.
- `blog-stats-markdown.ts`:
  - `blogStatsMarkdown(): string` — plain-text summary of the stats for the `Accept: text/markdown` path.
- `blog-stats.test.ts` — node project. Covers every helper incl. edge cases (empty posts, single
  year, multi-author post, tag limit boundary). This carries the coverage weight for the feature.

### Types — `src/types/`

- `BlogStats` type (e.g. `src/types/content/blog-stats.ts` or `src/types/stats.ts`), shared by the
  lib layer, the page, and the markdown generator. No `Record<string, never>` padding.

### Design-system (shared, hoisted)

Per the "used by 2+ consumers → hoist to shared" rule:

1. **`StatCard`** → `src/components/design-system/molecules/stat-card/`
   - Props: `{ value: number | string; label: string; icon?: ReactNode }`.
   - Presentational: `glow-container`, big accent value, label; optional leading icon.
   - Static value (no count-up) — consistent with the existing videogames data card.
   - Folder-per-component: `stat-card.tsx`, `stat-card.test.tsx`, `index.ts`.
   - **Refactor** `src/components/content/videogames/videogames-collection/videogames-collection.tsx`
     to import `StatCard` from design-system, and **delete** the page-local
     `videogame-collection-data-card/` folder.

2. **`ChartTooltip`** → `src/components/design-system/molecules/chart/chart-tooltip/`
   - Moved from `src/components/content/data-structures-and-algorithms/chart-tooltip/`.
   - Folder-per-component: `chart-tooltip.tsx`, `chart-tooltip.test.tsx`, `index.ts`.
   - **Update** the DSA charts that import it (e.g. `performance-comparison-chart`,
     `frequency-map-chart`, any others found via LSP find-references) to import from the new location.
   - Remove the old DSA `chart-tooltip/` folder once all references are migrated.

Both are pure UI (Matrix green-on-black), no `features/`/`lib/` runtime imports, `src/types` only as
type-only if needed — design-system self-containment preserved.

### Page components — `src/components/content/blog/blog-stats/` (folder-per-component)

- `blog-stats.tsx` (client, `"use client"`) — composes the page from injected `stats: BlogStats`
  props. Store curries any (optional) tracking; if there are no interactions, keep the store minimal
  and typed correctly (or omit if truly nothing — but a `use-blog-stats-store.ts` per convention).
- Page-local children, each its own folder (recharts wrappers, `glow-container`, Matrix palette,
  shared `ChartTooltip`, `ResponsiveContainer`):
  - `posts-per-year-chart/` — recharts `BarChart`.
  - `tag-distribution-chart/` — recharts `BarChart` (top-N).
  - `authors-chart/` — recharts `BarChart`.
- Hero row: grid of design-system `StatCard`s (mirrors videogames-collection grid layout).
- All motion-preference-aware where animation is used; charts respect the existing house style.

### Route — `src/app/blog/stats/page.tsx`

- Server component mirroring `src/app/blog/authors/page.tsx`.
- `generateMetadata()` for SEO.
- Calls `getBlogStats()` at build (static), passes `stats` into the client `BlogStats` component,
  wrapped in the existing content-page shell (`ContentPage` feature wrapper).

## Registration / wiring

| File | Change |
|------|--------|
| `src/types/configuration/slug.ts` | add `stats: \`${blog}/stats\`` under `blog` |
| `src/types/configuration/tracking.ts` | add `blog_stats` category + `open_blog_stats` action |
| `src/components/features/content/nav-config.ts` | add `blogStats: slugs.blog.stats` to `menuNavHrefs` |
| `src/components/design-system/organism/menu/menu.tsx` | add `blogStats` to `MenuNavHrefs`; add "Stats" item to the Blog dropdown (after "Archive"); destructure `onClickBlogStats` |
| `src/components/design-system/organism/menu/use-menu-store.ts` | add `onClickBlogStats` effect + `onTrackBlogStats?` in `MenuTrackingCallbacks` |
| composition where Menu tracking is assembled | wire `onTrackBlogStats` (mirror the other blog dropdown items) |
| `src/app/markdown/[[...path]]/route.ts` | register `/blog/stats` in `generateStaticParams` + add a case in the GET switch calling `blogStatsMarkdown()` |

## Testing

- **Unit (Vitest node):** `src/lib/blog-stats/blog-stats.test.ts` — every aggregation helper + edge cases.
- **Component (Vitest jsdom + RTL):**
  - `stat-card.test.tsx` — renders value + label (+ icon slot).
  - `chart-tooltip.test.tsx` — renders payload rows / handles inactive state.
  - `blog-stats.test.tsx` — renders with fixture `BlogStats`; assert headline numbers + section
    labels appear. Note: recharts `ResponsiveContainer` renders empty without dimensions in jsdom, so
    target counter/label text, not SVG internals. Do NOT add a separate `renderHook` store test.
- **E2E / live-QA:** e2e-sentinel smoke-walks `/blog/stats` and Blog-dropdown → Stats navigation at
  review; Playwright suite re-run because routing changed (add a nav assertion if cheap — optional,
  non-blocking).

## Rendering model

Fully **static at build** — `getBlogStats()` runs from frontmatter at `next build`; no runtime
secrets, no GA calls. recharts hydrates client-side.

## Out of scope

- Google Analytics live data (page views, unique visitors, top posts by views) — deferred; needs a
  new GA Data API service-account credential + property ID.
- Count-up / animated counters — using static cards for site consistency.

## Mechanical gates (must pass before review)

`npm run lint` · `npm run validate-architecture` · `npm run knip` · `npm run typecheck` (clean) ·
`npm run test:run` · `npm run build` · `npm run test:e2e` (routing changed).
