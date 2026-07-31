---
name: feature_reading_companion_toc
description: Article reading companion TOC + markdown section outline (delivery 1), shipped 2026-07-31
type: project
---

Delivery 1 of 3 for the "reading companion" (table of contents) feature, branch
`feat/reading-companion-toc`. Design fully settled in the approved plan before implementation — see
`docs/agentic-sdlc/` history if it still exists, otherwise this memory is the authoritative summary.

## What shipped

- `src/lib/content/headings.ts` — `extractHeadings(markdown)`: AST-based (unified/remark-parse +
  remark-math + remark-mdx, same registration order as `mdx-to-markdown.ts`), extracts h2/h3 only.
  **Feeds every heading (including h1 and h4+) through one `github-slugger` instance in document
  order**, but only pushes h2/h3 into the returned array — h1/h4+ still consume a dedupe slot even
  though they're never returned. This is required, not optional: `rehype-slug` slugs every heading it
  renders regardless of level, so skipping h1/h4+ in the slugger feed (not just in the output) would
  desync ids from the real rendered page the moment any heading at ANY level repeats text with an
  in-scope h2/h3. Verified against real content: `data-structures-and-algorithms/topic/array` has an
  h4 "Static Arrays" before an h3 of the same text — the h3 must get `static-arrays-1`, not
  `static-arrays`. Locked in as a synthetic regression test in `headings.test.ts`.
- Per-entry reading time computed from the raw markdown slice between one heading's end offset and the
  next heading's start offset (any level, not just h2/h3), fed straight into the existing `reading-time`
  package — mirrors how `Content.readingTime` itself is computed (raw string in, no HTML stripping).
- `src/lib/content/heading-viability.ts` — two pure, count-only predicates: `isTableOfContentsViable`
  (>=3, HTML) and `isMarkdownOutlineViable` (>=2, markdown). Neither knows about DSA/exercises by
  design — exercise exclusion from the HTML TOC happens ONLY because `exercise.tsx` never passes
  `headings` to `ReadingContentPage`, not via any predicate logic.
- `Content.headings: ContentHeading[]` is a **required** field (not optional) — the blast radius across
  literal `Content` constructions was small: 10 test-fixture files total (grep for
  `contentFileRelativePath:` to find all construction sites; reading properties doesn't require the
  field, only literal-construction call sites do).
- `src/lib/build/table-of-contents-report.ts` — prebuild report of pages failing the HTML gate,
  restricted to ONLY `slugs.blog.blogPost` + `slugs.dataStructuresAndAlgorithms.topic` entries in
  `contentRegistry`. Do NOT run `isTableOfContentsViable` over the whole registry — DSA exercises all
  have exactly 3 h2 (pass the count gate) but `exercise.tsx` never renders a TOC regardless, so an
  unrestricted report would queue ~250 pieces of editorial work that could never surface.
- `markdownDocument` (`src/lib/mdx/markdown-document.ts`) gained an optional `sections` field, rendered
  as a `## Table of Contents` block of full `siteUrl+slug+#anchor` deep links right after the header,
  ahead of the body. Resolved once in `contentItemMarkdown` (the single choke point every content-backed
  `/markdown` generator already routes through) — the 5 true aggregates (home, blog listing, contact,
  dsa home, blog stats) never call `contentItemMarkdown`, so they're structurally untouched and their
  tests stay green with zero changes.
- New organism `design-system/organism/table-of-contents/` — inline native `<details>` (collapsed by
  default, all breakpoints) + a `2xl:`-only fixed rail positioned via
  `left-[calc(50%+504px)]` (half of `.container-fixed`'s 960px max plus a 24px gap). h3 nested under
  h2 via `Accordion` + a new `forceOpen` prop (Accordion extended, backward compatible, to let external
  scroll-spy state keep a group open without taking over the user's own manual toggle — plain
  `defaultOpen` can't do this since it's mount-time-only). Single `IntersectionObserver`, elements
  resolved via `document.getElementById` per heading id (never `querySelector`).
- Wired into exactly 2 consumers per the approved plan: `blog-post-content.tsx` and DSA `topic.tsx`
  (gated by `isTableOfContentsViable(content.headings)` at the consumer). `exercise.tsx`, `about-me`,
  `mcp`, `cookie-policy` deliberately untouched.
- 2 new tracking actions: `toggle_table_of_contents`, `navigate_table_of_contents` (rolled up, heading
  text as the navigate label — matches the existing menu/footer action-hierarchy pattern).

## Measured-baseline discrepancy (flag for next agent, not a bug)

The approved plan's "measured baseline" claimed 26 of 96 blog posts clear the >=3 heading gate. Real
extraction (verified correct via DSA topics matching EXACTLY — 36/37 viable, matching the plan's own
number) finds only 10 blog posts clear it as of 2026-07-31. Cross-checked against grep counts and the
specific `software-engineer-skills-pyramid-harness-sdlc` post (which has ~30 heading-like lines inside
fenced code examples that the AST correctly excludes) — no bug found in extraction. Root cause is either
new content added since the plan's exploration pass, or the explorer measured differently (e.g. a
different regex). Reported honestly in the implementer handoff rather than silently reconciled.

## Review round 1 fixes (2026-07-31)

The initial delivery above shipped with several real bugs the reviewer + e2e-sentinel caught. Fixed in
commits `d0e92061`, `f2b7b9ac`, `47821547`, `249795b5`:

- **Slug id divergence**: `extractHeadings` was trimming heading text before feeding the slugger, but
  `rehype-slug` slugs `hast-util-to-string`'s output with no trim. A JSX-wrapped heading with a leading
  space (`## <Icon/> Hardware specs`, 11 videogame console pages) got a different id than the rendered
  anchor. Fixed by slugging the un-trimmed flattened text and trimming only the display `text`. Added a
  real `remark-rehype` + `rehype-slug` pipeline cross-check test (not just a hand-typed synthetic one) —
  `remark-rehype` and `hast` promoted to direct devDependencies for this purpose.
- **`groupHeadings` hierarchy bug**: nested an h3 into whatever the *previous group* was, even when that
  group's own heading was itself an h3 — an h3-only document (30% of TOC-eligible blog posts) collapsed
  into one bogus group. Fixed to only nest when the previous group's heading is level 2.
- **Structural/semantic rewrite of the organism** (`table-of-contents.tsx` + store): entries are now real
  `<a href="#id">` links (not buttons + scrollIntoView) so crawlers/keyboard/pre-hydration all work, and
  clicking pushes the hash via `history.pushState` (preventDefault suppresses the browser's own jump). A
  group heading with children now gets its own anchor **plus** a separate small toggle button (a11y name
  `Toggle <heading> section`) instead of being unreachable — this required abandoning `Accordion`'s
  title-in-button structure for groups (an `<a>` can't nest inside a `<button>`) and building the header
  row directly in the organism, while still using `Accordion` for the collapsible panel via an sr-only
  title. Fixed the `<li><li>` double-nesting bug (`renderGroup` no longer wraps a childless entry's own
  `<li>` in a second one). Rail breakpoint changed `2xl:` → `xl:` (this codebase overrides Tailwind's
  scale in `globals.css` to `xl: 1600px` / `2xl: 2000px`, so `2xl:` never activated on any real laptop).
  Two nav landmarks (inline `<details>` + rail) now have distinct accessible names ("Table of contents"
  vs "Table of contents (sidebar)") — real MDX headings ALSO get their own `.heading-anchor` `<a>` from
  `rehype-autolink-headings`, sharing an overlapping accessible name with the TOC's own link, so any
  e2e/production query for a TOC entry must be scoped through the nav landmark, not page-wide.
- **Scroll-spy IntersectionObserver bug**: the callback reset `activeId` to `undefined` whenever nothing
  was inside the (thin) `rootMargin` band, blanking the highlight for the reader's entire dwell time
  inside a heading's own prose before its first child. Simplified to only ever advance `activeId` forward
  on `isIntersecting`, never clear it — removed the `visibleIdsRef` Set bookkeeping entirely as a result.
- **Manual-intent-wins accordion bug**: clicking to close a scroll-spy-forced-open group silently
  reopened once scroll moved away. Root cause was two-layered: `Accordion`'s own `toggle()` flipped its
  last-remembered `manuallyOpen` value instead of the *currently visible* `isOpen` (so a click while
  force-open recorded a no-op "open" intent instead of "closed"), AND the TOC's own bookkeeping was a
  `Set<string>` (open/unset) with no way to represent "explicitly closed". Fixed both: `Accordion.toggle`
  now flips relative to `isOpen`; the TOC store now tracks `Map<string, boolean>` overrides that always
  win over the scroll-spy default (`groupOverrides.get(id) ?? activeGroupId === id`).
- **`Content.headings` required-field migration gap**: `content-item-markdown.ts`'s dead `?? []` guard
  existed only because 4 OTHER markdown-generator test suites (`posts-markdown`, `data-structures-and-
  algorithms-markdown`, `videogames-markdown`, `mdx-page-markdown`) had hand-typed `Content` mocks
  missing `headings` — a gap in the original "update every literal Content construction" migration.
  Removing the guard required adding `headings: []` to every one of those mocks.

**e2e gotcha worth remembering**: an inline `smooth` `scrollIntoView` can race against scroll-spy
reactively expanding a sibling accordion group as the scroll animation passes over it — the expansion
shifts layout underneath the in-flight scroll, landing short of the target. Reproduced deterministically
in Playwright; NOT fixed (pre-existing interaction, not introduced by this round, no reviewer/sentinel
finding named it) — worked around in e2e by forcing the app's own motion toggle off via
`localStorage.setItem("fabrizioduroni_motion", "off")` in `page.addInitScript` (NOT the OS
`prefers-reduced-motion` media query — `useReducedMotions` doesn't read that directly, only
`useMotionStore` + `useDeviceCapabilities().isLowEnd`), which exercises the deterministic instant-scroll
path. Also: Playwright's `toBeHidden()`/`isVisible()` does NOT recognize an ancestor's `overflow-hidden`
+ animated `height:0` (a Framer Motion `MotionDiv` collapsed accordion panel) as hiding a descendant —
it only inspects the element's own box. Assert via the toggle's `aria-expanded` attribute instead for
that case; native `<details>` closed state IS correctly recognized as hidden by Playwright.

## Test-infra note

`e2e/terminal.spec.ts` is flaky under back-to-back `npm run test:e2e` invocations (each spins its own
`next build && next start` on port 3000) — saw 3 clean 84/84 runs and 2 runs with terminal-only failures
(once a single test, once ~20 tests) across ~5 consecutive full-suite runs, with zero terminal source
files touched by this branch. Consistent with the existing memory note in
`feedback_review_fix_disk_and_reset_soft.md` about stale-server/port artifacts — don't chase this as a
regression from unrelated feature work; re-run once with a clean port check (`lsof -i :3000`) before
concluding a terminal.spec.ts failure is real.
