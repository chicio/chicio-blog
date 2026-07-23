---
name: feature_terminal_navigation
description: Terminal is a global full-screen overlay (evolved from a windowed /terminal route, 2026-07-23) — architecture, hard-won gotchas, deferred ideas
type: project
---

## Overview

A Unix-shell-style REPL over the site's content tree: `ls`, `cd`, `pwd`, `tree`, `cat`, `open`, `help`/`man`,
`clear`, `search <query>`, `close`/`exit`. Shipped 2026-07-23 as a windowed `/terminal` route (draft PR #480),
then EVOLVED the same day into a **global full-screen modal overlay** (Model A: "overlay drives the real
router") per an approved grilling redesign. Branch `worktree-feat+terminal-navigation`.

## Current architecture (overlay model — supersedes the windowed-route version)

- **Mounting**: `src/components/features/terminal/terminal/` (moved from `content/terminal/`), mounted
  app-wide via `<Terminal />` in `layout-additional-content.tsx` (same pattern as `CommandPalette`). The
  component itself is ALWAYS mounted; it renders `null` unless its internal `open` state is true, so its
  store's effects (manifest fetch, popstate/Esc listeners) are live for the whole app session.
- **Opening**: (1) command-palette `> Open terminal` action dispatches a window event
  (`terminalOverlayOpenEvent` in `design-system/state/terminal/terminal-events.ts`) instead of
  `router.push('/terminal')` — no URL change, origin = current page. (2) `/terminal` is now a **shareable
  boot link**: `src/app/terminal/page.tsx` renders an inert fallback string; the overlay's own store detects
  `window.location.pathname === slugs.terminal` on mount, `replaceState`s the URL to `/`, and opens itself
  over the homepage.
- **open vs cat vs cd**: ONLY `open` mutates history (`router.push` + a `TerminalRenderContentIntent` with
  `historyInert: false`). `cat` renders the SAME in-shell content but `historyInert: true` (no URL change —
  a peek). `cd`/`ls`/`tree`/`pwd`/`search`/`help`/`clear` stay URL-inert as before.
- **In-shell rendering**: engine's `TerminalExecutionResult.renderContent?: TerminalRenderContentIntent`
  (`{route, title, historyInert}`) signals the store to fetch `/markdown/<route>` DIRECTLY (see
  `src/lib/terminal/terminal-markdown-route.ts::toMarkdownFetchUrl` — `/` maps to bare `/markdown`). This is
  a **direct fetch, not `Accept: text/markdown` negotiation** — deliberately bypasses the GA4
  Measurement-Protocol tracking that fires in `proxy.ts` for that header, so human terminal use doesn't
  register as an AI-agent markdown hit. Rendered via the existing `Markdown` atom
  (`design-system/atoms/typography/markdown`), wrapped in a new `TerminalContentBlock` (private child of
  `terminal-scrollback/`) between `─── <route> ───` / `─── EOF ─ close for full page ───` separators, with a
  fetch-status state machine (`loading`/`success`/`unavailable`/`error`; 404 → "no terminal view available"
  stub, other failures/timeout (8s `AbortController`) → generic error line).
- **popstate mirroring**: `src/lib/terminal/terminal-path.ts::resolveRouteForPopstate` (pure, tested) reverse
  -looks-up the browser's current pathname against the manifest (`findNodeByRoute`, also new) to derive
  `{cwd, title, route}` for Back/Forward; homepage `/` is special-cased since it's never itself a manifest
  node. A route with no manifest match still renders (title = raw pathname), just leaves cwd unset.
- **Close**: `close`/`exit` commands (new, in `FS_INDEPENDENT_COMMANDS`) + Esc + backdrop click all just
  flip `open` to false — no history entry ever created or consumed by closing (refresh-while-open naturally
  exits since `open` is plain `useState`, never persisted).
- **A11y (modal)**: `role="dialog"` + `aria-modal="true"` on the panel; focus captured
  (`document.activeElement`) on open and restored on close; **background inert** via a new
  `AppRootBoundary` component (`features/terminal/app-root-boundary/`, wraps `{children}` in
  `src/app/layout.tsx` as `display:contents` so it never affects layout) whose DOM node is registered into a
  tiny module-scope singleton (`src/lib/terminal/terminal-overlay-dom.ts::registerAppRootElement`/
  `getAppRootElement`) — the overlay's store toggles `inert`/`aria-hidden` on that node while open. No
  explicit Tab-focus-trap needed: Tab was already fully `preventDefault()`-ed on the terminal input for
  completion (#480 behavior), and `inert` blocks any path into the background regardless.
- **Tracking**: `open` → `router.push` still fires the normal GA pageview (not suppressed); ALSO fires one
  custom `trackWith` event (`tracking.action.terminal_open`, `tracking.category.terminal`, both new) with
  `label` set to the opened route/slug (the existing `TrackingPayload` shape has no room for a separate
  `content_type` field without a wider change, so that part of the original ask was scoped down — flagged,
  not silently dropped).

## Hard-won gotchas from the overlay redesign (new, on top of the #480 list below)

8. **`react-hooks/set-state-in-effect` also fires for a plain conditional effect body**, not just unconditioned
   ones (confirms gotcha #3 below generalizes). A "detect boot condition on mount and setState" effect
   (`if (window.location.pathname === slugs.terminal) { setOpen(true); ... }`) is flagged even though it only
   runs once. Fix used here: compute the boot flag as a plain `const` read at the top of the store function
   (`window.location.pathname === slugs.terminal`), and feed it into **lazy `useState` initializers**
   (`useState(() => isBootLink)`) for `open`/`announcement` — initializers aren't effects, so no violation.
   The actual DOM side effect (`window.history.replaceState`, not a setState call) still lives in a
   `useEffect(() => { if (isBootLink) {...} }, [isBootLink])` — that's fine since it never calls a React
   setter.
9. **`KeyboardEvent` import collision**: importing `KeyboardEvent` from `"react"` (needed for the input's
   `onKeyDown` prop type) shadows the DOM lib's global `KeyboardEvent` for the rest of the file. A
   `window.addEventListener("keydown", handler)` callback typed as `(e: KeyboardEvent) => void` then fails
   `tsc` with a confusing overload-mismatch error. Fix: type that one callback param as
   `globalThis.KeyboardEvent` explicitly.
10. **Playwright ambiguity from the "page mounts underneath" architecture**: after `open <path>`, BOTH the
   in-shell content block AND the real page (now actually routed there via `router.push`) render an
   `<h1>` with the same page title simultaneously — this is the intended architecture working, not a bug, but
   any e2e assertion on page content must be scoped to `page.getByRole("dialog", ...)` (or `.last()` when the
   scrollback itself accumulates repeat visits, e.g. after Back+Forward) to avoid Playwright's strict-mode
   "resolved to N elements" failure.
11. **`codegraph_explore`'s index reflected a stale/different worktree state** during this session — it
   returned an OLDER version of `use-command-palette-store.ts`/`layout-additional-content.tsx` missing the
   `terminalSlug`/`onOpenTerminal` wiring that plainly existed on disk (verified via direct `Read`). Always
   `Read` the ground truth for files you're about to edit in a multi-agent pipeline worktree; don't trust a
   single codegraph answer for "does X already exist" questions when the file is one a prior pipeline stage
   just touched.
12. **Reverse route→virtual-path lookup needs its own pure function**: `findNodeByRoute`/
   `resolveRouteForPopstate` (both in `terminal-path.ts`) reconstruct the manifest's `path` (e.g.
   `/blog/2024/hello-world`) from a real URL (`/blog/post/2024/01/01/hello-world`) by walking the tree and
   comparing each node's `.route` field — NOT string manipulation on the URL itself, since the two path
   shapes diverge (manifest groups by slug, not by full date-prefixed URL segments).

## Overlay design decisions confirmed

- Scrollback/cwd/command-history persist across repeated open→close→reopen within the same page session
  (the store is a single always-mounted instance) — deliberately did NOT reset on close, only `clear` or a
  hard refresh resets it.
- Dropped the old `GenericHeader`/`Menu`/`ContentContainer` page chrome and the `TerminalIcon` atom it used
  (both removed) — an overlay floating over the real page (which already has its own Menu) doesn't need a
  second page header; this was a necessary, in-scope deviation from keeping the visual chrome identical.
- `terminalSlug` prop threading was removed entirely from `CommandPalette`/`use-command-palette-store.ts`
  once the palette action switched to the event-based open (the prop had no remaining consumer).
- Local Playwright runs with full parallelism (no `--workers` flag) can flake the palette-open retry under
  6-worker CPU contention; the same spec is 100% stable with `--workers=1` (the CI-configured value). Not a
  bug in the feature — pre-existing characteristic of the palette-open flow's retry budget under local load.

## Prior (#480 windowed-route) gotchas — still relevant to the pure engine/manifest layer

1. **`chicio/store-return-shape` ESLint rule is filename-triggered, not scope-aware**: it flags ANY
   `ReturnStatement` with an `ObjectExpression` argument, or ANY arrow function with an object-literal
   expression body, anywhere in a `*-store.ts` file. Fix: move object-shape-producing helpers to `lib/`.
2. **React Compiler `react-hooks/refs`**: reading `ref.current` inside a `useState(() => ...)` lazy
   initializer is flagged even though it only runs once. Avoid ref-based counters in initializers.
3. **React Compiler `react-hooks/set-state-in-effect`** (generalized above as gotcha #8 of this session): the
   sanctioned escape hatch is the render-time diff pattern (`previousX`/`setPreviousX` compared directly in
   the render body) OR setting state inside a `.then()`/`.catch()` callback (not synchronous in the effect
   body) OR — new this session — deriving the value via a lazy `useState` initializer instead of an effect.
4. **`Element.prototype.scrollIntoView` is unimplemented in jsdom** — stub it in `beforeEach`.
5. **`useSearch`'s fetched index has TWO async gaps** (fetch + `elasticlunr.Index.load` inside a
   `startTransition`) — wrap type-and-assert e2e blocks in `toPass({ timeout })`.
6. **Client-fetched build artifacts race commands under parallel load**: `needsFilesystem(commandName)` in
   the pure engine lets `help`/`man`/`pwd`/`clear`/`search`/`close`/`exit` run instantly regardless of
   manifest-load state.
7. **Worktree `.env`/`node_modules` gaps**: `.env.*` files aren't copied by `git worktree add`; a fresh
   worktree's own near-empty `node_modules/.bin` makes `knip` false-positive a pile of "unused
   dependency"/"unlisted binary" findings until `npm ci` is run inside the worktree.

## Green phosphor image treatment (2026-07-23 polish, PR #480; corrected same day after live QA)

**v1 (superseded, do not reintroduce)**: a `grayscale sepia hue-rotate-90 saturate-[4] brightness-90` CSS
filter chain. Live QA (`fabrizioduroni-e2e-sentinel`) caught that this reads **olive/khaki, not green**, on
warm-toned source images (e.g. Game Boy screenshots) — grayscale→sepia→hue-rotate tints *relative to each
pixel's original hue*, so a warm source hue doesn't land on the same rotated hue as a neutral one. A
plain filter chain is fundamentally hue-relative, not hue-independent; no amount of retuning the rotation
angle fixes that for all source colors.

**v2 (current)**: a true luminance→green **duotone** via an inline SVG `<filter id="terminal-phosphor">`:
1. `feColorMatrix type="matrix"` collapses RGB to Rec.709 luminance in all three channels (rows
   `0.2126 0.7152 0.0722 0 0` repeated for R/G/B, identity for alpha) — i.e. a real grayscale, not the CSS
   `grayscale()` function.
2. `feComponentTransfer` with `feFuncR/G/B type="table"` remaps that luminance ramp: shadow ≈ near-black
   (`0.02 0.05 0.02`) at luminance 0, highlight = the site's actual `--color-accent` `#39FF14` normalized to
   `0.224 1 0.078` at luminance 1. Every pixel, regardless of source hue, lands somewhere on that fixed
   black→green ramp — this is what makes it hue-independent (fixes the v1 olive/khaki bug).

Applied via Tailwind arbitrary property `[&_img]:[filter:url(#terminal-phosphor)]` (confirmed compiles to
`.\[\&_img\]\:\[filter\:url\(\#terminal-phosphor\)\] img{filter:url(#terminal-phosphor)}` in the real
build). The `<filter>` def itself is NOT inline in `TerminalContentBlock` (multiple content blocks can be
on screen at once in scrollback, and duplicate SVG element `id`s are invalid) — it's mounted ONCE in
`Terminal` (`terminal.tsx`), inside the dialog panel, as a `aria-hidden absolute h-0 w-0 overflow-hidden`
`<svg>`, present whenever the overlay is open (before any content block can render). `alt` text and the
border/glow treatment (`border-accent/40 border rounded shadow-[0_0_8px_var(--color-accent-alpha-25)]`)
are unchanged from v1. Scoping via `[&_img]` (not a global rule) still means it can never leak onto
real-page images.

Test coverage: `terminal-content-block.test.tsx` asserts via `data-testid="terminal-content-phosphor-
images"` on the wrapper (not `.closest("div")` — code review flagged that as fragile DOM-nesting coupling)
that the filter class and border-accent are present and the image keeps its accessible name/alt.
`terminal.test.tsx` asserts `container.querySelector("filter#terminal-phosphor")` exists once the overlay
is open.

**Tailwind v4 gotcha confirmed**: an isolated `@tailwindcss/cli` throwaway test harness (import the site's
real `globals.css` + a scratch `--content` html file) produced a false negative for these exact classes —
content auto-detection inside a project directory seems to override/ignore an explicit `--content` flag
in a way that doesn't scan a newly added scratch file. Don't trust that pattern for verifying whether a
class compiles; instead build the real project (`npm run build`) and grep the compiled
`.next/static/chunks/*.css` for the literal escaped selector (e.g. `\.\[\&_img\]\:hue-rotate-90`). That
DID confirm all rules generated correctly in the real build.

## Design decisions confirmed (from #480, still true)

- `open`/`cat` support directories with a `route` too (not just leaf files).
- Tab completion and mobile "tappable chips" are the SAME mechanism (`completeInput()` renders chips on
  every keystroke; Tab just auto-fills when there's exactly one match).
- `search` bridges to the existing `useSearch` hook rather than building a second search index.
- Deliberately did NOT let `open <index>` reference the last `search` result set — still out of v1 scope.
