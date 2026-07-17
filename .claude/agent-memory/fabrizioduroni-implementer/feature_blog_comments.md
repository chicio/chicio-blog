---
name: feature_blog_comments
description: Blog comment system — giscus live widget + static legacy Disqus archive on blog post pages
type: project
---

**2026-07-17 update**: `BlogComments` is no longer a pure pass-through wrapper — it now legitimately owns
`use-blog-comments-store.ts` (a `StateStore`, no effects). Rationale: it drives a simulated
`TerminalProgressBar` ("loading comments" → "comments loaded", lowercase terminal voice) while giscus's
iframe loads, since giscus reports no load progress of its own. Percentage ticks asymptotically toward
90% (`setInterval` 350ms, `increment = max((90 - current) * 0.15, 0.5)`), then jumps to 100% and — after
a ~400ms beat (skipped under `useReducedMotions()`) — flips `isLoaded`. Completion is triggered by
`window.addEventListener("message", ...)` filtered to `event.origin === "https://giscus.app"` (the giscus
iframe posts a message once alive), with a 12s fallback timeout so an offline/errored giscus never leaves
a stuck bar. Giscus itself stays mounted the whole time (only the progress bar is conditionally rendered)
because unmounting would stop the iframe from ever loading and firing that message. Chose **mount-start**
over gating the simulation on `useInView` (component nearing viewport): jsdom has no global
`IntersectionObserver` polyfill in this repo's `vitest.setup.ts`, so an in-view gate would force every
consuming test to stub `IntersectionObserver` just to unblock rendering — not worth it since the
component is not lazy-mounted at the React level anyway (giscus's own `loading="lazy"` already defers the
network fetch). See [[feature_terminal_list_item]] for the presentational half reused inside search
results — NOT used here, this is a distinct progress-bar UI.

Implemented 2026-07-17 (PR pending, branch `feat/blog-comments`). Two independent halves, both scoped
ONLY to `/blog/post/[year]/[month]/[day]/[slug]`:

**Live comments — giscus (GitHub Discussions)**
- `@giscus/react` (`Giscus` default export), config constant at `src/types/configuration/giscus.ts`
  (pattern: same shape as `siteMetadata`/`slugs`). `categoryId` is a PLACEHOLDER
  (`"GISCUS_CATEGORY_ID_PENDING"`) — fill in once Fabrizio creates the "Blog comments" Discussions
  category in the GitHub UI, before merging to main.
- `@giscus/react`'s `Giscus` component renders `null` on first render, then lazily imports and renders
  a `<giscus-widget>` custom element client-side (via `useEffect`). This means: (a) it never renders
  anything server-side/in a static HTML diff, (b) Playwright e2e must assert on `page.locator("giscus-widget")`
  with `toBeAttached()`, never wait on the internal iframe (external network, not mocked). (c) jsdom
  component tests must mock `@giscus/react` entirely (`vi.mock("@giscus/react", ...)`) since jsdom has
  no custom-element/iframe rendering suited to it.
- No store — `BlogComments` (`src/components/content/blog/blog-comments/`) is a pure `"use client"`
  config wrapper, no state/handlers. Consistent with [[feedback_no_passthrough_store]].
- NOT gated behind cookie consent — giscus sets no tracking cookies (consent gate is GA-only).
- Custom Matrix theme at `public/giscus-matrix.css`, passed as the absolute production URL
  `https://www.fabrizioduroni.it/giscus-matrix.css` (giscus requires HTTPS for custom themes — on
  localhost dev it silently falls back to giscus's unstyled default, this is expected/documented in
  the component, not a bug).
- Theme CSS structure: giscus's `theme` prop, when given a URL, has the client inject that URL as a
  **full replacement stylesheet** (not an additive override) — so the custom CSS file must define the
  COMPLETE custom-property set giscus's base styles read (`--color-prettylights-*`, `--color-btn-*`,
  `--color-fg-*`, `--color-canvas-*`, `--color-border-*`, `--color-accent-*`, etc.), not just partial
  color overrides. Built by taking giscus's own `dark.css`/`transparent_dark.css` (MIT, fetchable at
  `https://giscus.app/themes/<name>.css`) as the structural template and remapping every value to the
  site's Matrix green-on-black palette + Open Sans/Courier Prime font stack.

**Archived comments — static legacy Disqus data**
- Source JSON pre-generated/pre-sanitized OFFLINE (not by this agent, not in this repo) and copied
  verbatim to `src/content/blog/archived-comments.json` — 17 slugs, 47 comments, one-level nesting
  (`{ [slug]: [{ author, date, message, replies: [{author,date,message}] }] }`). The Disqus XML/parse
  script are intentionally NOT committed.
- Lookup lib: `src/lib/content/comments/comments.ts` — `getArchivedCommentsBy(slug)`, reads the JSON via
  `fs.readFileSync` + `JSON.parse` (NOT a static TS import), following the exact pattern of
  `src/lib/content/gray-matter.ts`/`content.ts` (fs-based content reading, wrapped in the `cached()`
  build-cache helper). A static `import archivedCommentsData from ".../archived-comments.json"` would
  also work (resolveJsonModule is on) and wouldn't violate dependency-cruiser (lib-no-components only
  forbids importing components/app, not content/), but fs-reading matches how every other content-lib
  function in this repo sources its data, so it was preferred for consistency.
- Slug lookup key = the bare last path segment (e.g. `"dynamic-imports-webpack-chunks"`), obtained via
  `post.slug.params.slug` (the dynamic-route param, NOT `post.slug.formatted` which is the full
  `/blog/post/.../slug` path). This matches how `src/app/markdown/[[...path]]/route.ts` also destructures
  `post.slug.params.slug` for its own per-post lookups.
- `ArchivedComments` (`src/components/content/blog/archived-comments/`) is a plain (non-async) server
  component: takes `slug` prop, calls the lib lookup itself (matches the existing `RecentPosts`
  pattern — content components own their own lib data-fetching from a slug/id prop, they are not handed
  pre-resolved data by the parent). Renders `null` when no comments exist for the slug.
  `dangerouslySetInnerHTML` is used for the comment body — acceptable ONLY because the data is static,
  repo-committed, pre-sanitized JSON (documented in a single code comment at the render site, per
  [[feedback repo style]] "no decorative comments" — but explanatory rationale comments ARE fine, see
  precedent in `src/components/features/seo/jsond-ld/jsond-ld.tsx`).
- Private, single-consumer sub-component `ArchivedCommentEntry` lives inline in the same `.tsx` file
  (not its own nested folder) — this matches existing repo precedent for small non-exported render
  helpers (e.g. `BreadcrumbContent` inside `breadcrumb.tsx`), not every internal helper needs its own
  folder+store+index.ts.

**Integration point**: `BlogPostContent`'s `afterContent` JSX (`src/components/content/blog/blog-post-content/blog-post-content.tsx`),
appended after `PostTags`/`RecentPosts`: `<ArchivedComments slug={post.slug.params.slug} /><BlogComments />`.

**Environment gotcha**: pipeline worktrees do NOT inherit `.env.development`/`.env.production` (gitignored,
not copied by `git worktree add`) — `npm run build` fails immediately with "Missing API key" (Resend) /
missing Upstash config if they're absent. Copy them from the main checkout before running `build`/`test:e2e`
in a fresh worktree. This is a worktree environment gap, not a code bug.
