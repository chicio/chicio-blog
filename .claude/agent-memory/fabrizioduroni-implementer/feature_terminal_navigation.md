---
name: feature_terminal_navigation
description: /terminal Unix-shell navigation feature (2026-07-23) — architecture, hard-won gotchas, deferred ideas
type: project
---

## Overview

Shipped a dedicated `/terminal` route: a Unix-shell-style REPL over the site's content tree. Commands:
`ls`, `cd`, `pwd`, `tree`, `cat`, `open`, `help`/`man`, `clear`, `search <query>`. Entry point: new
"> Open terminal" quick action in the command palette. Branch `worktree-feat+terminal-navigation`.

## Architecture

- **Pure engine** `src/lib/terminal/`: `terminal-path.ts` (resolvePath/findNode/findDir, `~`/`..`/`.`/absolute/relative),
  `terminal-completion.ts` (`completeInput`/`applyCompletion`, command-aware: `search` gets no path completions,
  `man` completes against command names not paths), `terminal-engine.ts` (`parse`/`execute`/`needsFilesystem`/
  `formatSearchResults`), `terminal-screen-lines.ts` (`toScreenLines`: output-line → UI-line with sequential ids).
  Zero JSX, zero `next/navigation` — `execute()` returns intents (`navigateTo`, `searchQuery`, `clearScreen`), the
  component store performs the actual `router.push` / `useSearch` call.
- **Filesystem manifest**: `src/lib/build/filesystem-manifest-factory.ts` (pure `generateFilesystemManifest()`,
  built from `getPosts()`/`getAllDataStructuresAndAlgorithmsTopics()`/`getAllExercises()`/`getAllConsoles()`/
  `getAllGames()`) + `filesystem-manifest.ts` (impure save step, mirrors `search.ts`'s write pattern). Wired into
  `prebuild.ts` alongside `generateAndSaveSearchIndex()`. Tree shape: `blog/<year>/<slug>`, `dsa/<topic>/<exercise>`,
  `videogames/<console>/<game>`, plus flat leaves `about-me`/`art`/`chat`/`contact`. **`public/filesystem.json` is
  committed to git** (same as `public/search-index.json` — checked, neither is gitignored; only `public/sw*`,
  `public/swe-worker*`, `public/media/content/` are).
- **Component**: `src/components/content/terminal/terminal/` (`terminal.tsx` + `use-terminal-store.ts` + private
  `terminal-scrollback/` + `terminal-prompt/` children). Bypasses `ContentPage` (no Footer/BrandHeader) — mirrors
  `Chat`'s minimal `Menu + ContentContainer` shell since this is an immersive full-screen tool, not a content page.
  `GenericHeader` hides once `history.length > 0` (frees vertical space for scrollback, same idea as Chat hiding its
  welcome header once messages exist).

## Hard-won gotchas (would burn the next agent otherwise)

1. **`chicio/store-return-shape` ESLint rule is filename-triggered, not scope-aware**: it flags ANY `ReturnStatement`
   with an `ObjectExpression` argument, or ANY arrow function with an object-literal expression body, **anywhere in
   a `*-store.ts` file** — not just the store's own top-level return. A `.map((x) => ({...}))` inside a store to
   build UI lines trips it. Fix: move the object-shape-producing helper to `src/lib/` (a plain `.ts` file, not
   `-store.ts`), or restructure to return arrays/build objects via `const x = {...}` variable assignment (not a bare
   return/arrow-expression) inside the store.
2. **React Compiler `react-hooks/refs`**: reading `ref.current` inside a `useState(() => ...)` lazy initializer is
   flagged ("Passing a ref to a function may read its value during render") even though it only runs once on mount.
   Avoid ref-based counters in initializers — use static/hardcoded ids for seed data, or derive ids from array
   length (`prev.length`) inside a `setState` updater instead of a ref-based counter.
3. **React Compiler `react-hooks/set-state-in-effect`**: calling a state setter synchronously in a `useEffect` body
   is flagged even when conditioned. The codebase's sanctioned escape hatch (already used by
   `use-command-palette-store.ts` for reacting to `useSearch`'s returned value changing) is the **render-time diff
   pattern**: keep a `previousX` state, compare `if (previousX !== x) { setPreviousX(x); ...conditionally setState... }`
   directly in the render body, not in an effect. Setting state inside a `.then()`/`.catch()` promise callback
   inside an effect is fine (not "synchronous within the effect").
4. **`Element.prototype.scrollIntoView` is unimplemented in jsdom** — RTL tests must stub it
   (`Element.prototype.scrollIntoView = vi.fn()` in `beforeEach`) or any effect calling it throws. Prefer
   `scrollIntoView` on a bottom-anchor `<div>` over directly mutating `.scrollTop` (the latter trips
   `react-hooks/immutability` since it's a property write on a ref'd DOM node, not a method call).
5. **`useSearch`'s fetched index has TWO async gaps, not one**: (a) the `fetch()` promise resolving, and (b) the
   `elasticlunr.Index.load()` parse + `setSearchIndex` landing inside a `startTransition`. Waiting for
   `page.waitForResponse("**/search-index.json")` in Playwright only closes gap (a) — gap (b) can still race a
   same-tick `fill()+Enter`. Fix at the test level with a `toPass({ timeout })` retry wrapper around the whole
   type-and-assert block (same pattern `e2e/search.spec.ts` should arguably also use, though it gets away with it
   via `pressSequentially` burning enough wall-clock time per keystroke).
6. **Client-fetched build artifacts race commands on page load under parallel CI load**: initially gated ALL
   terminal commands behind "filesystem is still loading" until `filesystem.json` resolved. Under `npx playwright
   test` with 6 parallel workers (CPU contention), this window widened enough to flake `help`/`ls`/`open` e2e tests
   that ran immediately after `page.goto`. Real fix (not just a test tweak): added `needsFilesystem(commandName)` to
   the pure engine so `help`/`man`/`pwd`/`clear`/`search` — which don't touch the tree — run instantly regardless of
   manifest-load state; only `ls`/`cd`/`tree`/`cat`/`open` (and unknown commands, defensively) wait. Locked in with
   an RTL regression test that runs `help` *before* flushing the mount-effect microtask queue.
7. **Worktree `.env` gap bit again** — see `[[feedback_worktree_git_stash_hazard]]`'s neighbor,
   `feature_blog_comments.md`'s "worktree .env gotcha": `.env.development`/`.env.production`/`.env.others` are
   gitignored and NOT copied by `git worktree add`. `npm run build` fails with "Missing API key" (Resend) until you
   `cp` them from the main checkout. Also hit: a **fresh worktree has no `node_modules` of its own** — Node's
   ancestor-directory module resolution silently falls back to the main repo's `node_modules`, so `vitest`/`tsc`/
   `eslint` all appear to work, but **`knip` false-positives a pile of "unused dependency"/"unlisted binary"**
   findings (react-dom, tsx, husky, serwist, ...) because its binary/dependency resolution is scoped to the
   worktree's own (near-empty) `node_modules/.bin`. Fix: `npm ci` inside the worktree once, before trusting `knip`.

## Design decisions confirmed

- `open`/`cd` support directories with a `route` too (not just leaf files) — e.g. `cd blog && open .` conceptually
  works because `blog/`, DSA topic dirs, and console dirs all carry their own real route alongside `children`.
- Tab completion and mobile "tappable chips" are the SAME mechanism: `completeInput()` result renders as chips below
  the prompt on every keystroke (once ≥1 char typed) on both desktop and mobile; Tab just auto-fills when there's
  exactly one match. No separate mobile code path.
- `search` bridges to the existing `useSearch` hook (same `searchIndexFileName` as the command palette) rather than
  building a second search index — the engine's `execute()` returns a `searchQuery` intent; the store calls
  `handleSearch()` and formats results via the pure `formatSearchResults()` once the hook's `search` state updates.
- Deliberately did NOT let `open <index>` reference the last `search` result set (would need engine `execute()` to
  take search-result context) — v1 scope per the approved plan; flagged as a nice-to-have follow-up, not built.
