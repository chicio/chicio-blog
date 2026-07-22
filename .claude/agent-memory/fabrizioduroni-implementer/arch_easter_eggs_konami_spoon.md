---
name: Konami/Spoon global-listener easter eggs architecture
description: Pure-logic + store-phase-machine pattern for global keydown easter eggs, plus test mocking gotchas
type: project
---

Added 2026-07-22: "I Know Kung Fu" (Konami code) and "There Is No Spoon" (typed phrase) easter eggs,
bringing the hunt page to 4 eggs. See [[feature_easter_eggs]] for where these mount.

## Pure logic lives in src/lib/easter-eggs/ (new home, framework-free, node vitest project)

- `konami-sequence.ts` — `KONAMI_SEQUENCE` (ArrowUp x2, ArrowDown x2, ArrowLeft/Right x2, "b", "a" lowercase),
  `appendKonamiKey` (rolling buffer capped at sequence length), `matchesKonamiSequence` (exact match).
- `spoon-phrase-buffer.ts` — `SPOON_PHRASE = "there is no spoon"`, `appendToSpoonPhraseBuffer` (only appends
  `key.length === 1`, so Shift/Enter/Backspace/arrows are no-ops; capped at 40 chars), `matchesSpoonPhrase`
  (normalizes by lowercasing AND stripping ALL whitespace, not just collapsing it, on both sides — so
  "there   is no spoon" and "thereisnospoon" both match; uses `.endsWith()` so the phrase can be a suffix of
  a longer buffer).
- `input-focus-guard.ts` — `shouldIgnoreKeystroke(target)` takes a duck-typed `{ tagName?, isContentEditable? }`
  (not a real DOM type) so it stays framework-free; ignores input/textarea/select tags and any
  contenteditable. Only Egg B (spoon) uses this — Egg A (Konami) intentionally does NOT, per plan: arrow keys
  in a search box are harmless and the code is unlikely to fire by accident.

## Component/store pattern

- `kung-fu-easter-egg/`: `ComponentStore<{active}, {dismiss}>`. Global keydown listener accumulates into a
  `useRef<string[]>` buffer (not state — avoids re-running the effect every keystroke) via `appendKonamiKey`;
  on match, sets `active`, fires `trackWith` once, plays `new Audio("/media/sounds/i-know-kung-fu.mp3")`
  (fire-and-forget, `.catch(() => {})`, same pattern as `neo-room-easter-egg`). While active, only Escape is
  handled (dismiss); overlay click also dismisses via `Overlay`'s `onClick` prop. Renders `Overlay` +
  `CenterContainer` + `MatrixTerminal` with a dedicated `kungFuTerminalLines` constant.
- `spoon-easter-egg/`: `StateStore<{warping, reducedMotion}>` only — no effects, it is fully self-resetting
  via timers, no user-facing controls. Store is a 3-phase state machine (`"idle" | "glitching" | "warping"`),
  mirroring `dejavu`'s glitch-timeout + reset-timeout structure exactly (400ms body `glitch-active` shake, then
  1600ms warp/rain, then back to idle). `useReducedMotions()` (OS + site toggle + low-end device) decides
  whether to skip the glitch phase entirely (reduced motion jumps straight to "warping"). The component uses
  `AnimatePresence` + `motion.div` directly from `framer-motion` (not the `MotionDiv` design-system atom,
  which only checks the site motion toggle, not the stronger `useReducedMotions` signal) to render a
  skew+scale ripple in full motion vs. a pure opacity crossfade when `reducedMotion` is true (transform
  values locked to identity). Payoff is the existing `MatrixRain` atom, not a bespoke effect.

## Content and tracking additions

- `kungFuTerminalLines: EasterEggTerminalLines` lives in `src/lib/content/easter-eggs/easter-eggs-content.ts`
  alongside the hints/intro-lines (co-located easter-egg copy), NOT inside the component file. 10 lines
  ("loading construct..." through skill names to "I know kung fu." as the final `type: "quote"` line) with
  `delay`s hand-tuned (200ms first + 600ms each of 8 + 800ms last = 5800ms delay budget) plus the typewriter's
  fixed 50ms/char typing speed (184 total chars = 9200ms) to land at ~15000ms total, matching the extracted
  audio's actual 15.21s duration (verified via `ffprobe` before tuning).
- Two new `tracking.action.*` keys: `easter_egg_konami`, `easter_egg_spoon`. Labels use the hint ids
  (`i_know_kung_fu`, `there_is_no_spoon`) under the existing `tracking.category.easter_egg_hunt`.
- The hunt page's existing tests (`easter-eggs.test.tsx`, `easter-egg-hunt-markdown.test.ts`,
  `indexable-content.test.ts`) are all fully data-driven (`.forEach` over `easterEggHints`/
  `easterEggHuntIntroLines`) — adding 2 hints and changing the intro count text needed ZERO test edits, they
  passed unchanged. Don't assume a plan's "update the tests" instruction is always needed; check first.

## Test mocking gotchas hit while writing this

- `vi.mock` factories referencing a module-level mock function MUST wrap it in `vi.hoisted()` — a bare
  `const mockUseReducedMotions = vi.fn()` above the `vi.mock` call throws "Cannot access before
  initialization" because `vi.mock` is hoisted above all imports/consts. Pattern:
  `const { mockUseReducedMotions } = vi.hoisted(() => ({ mockUseReducedMotions: vi.fn().mockReturnValue(false) }));`
  (already documented for other mocks in [[feature_testing_pyramid]], re-confirmed here for hooks).
- A component that renders `AnimatePresence`/`motion.div` directly from `framer-motion` (not through
  `MotionDiv`) needs `vi.mock("framer-motion", ...)` in its own test, mirroring the exact mock block already
  used in `matrix-rain-control-panel.test.tsx` (`AnimatePresence` → passthrough fragment, `motion.div` →
  plain `<div>` stripping `initial/animate/exit/transition`). Without this, `vi.useFakeTimers()` interacts
  unpredictably with framer-motion's real exit-animation lifecycle.
- `document.activeElement` in jsdom defaults to `<body>` (not `null`), so a focus-guard test needs to actually
  create+append+focus an `<input>` (and remove it after) to exercise the "ignore keystroke" branch — a plain
  `fireEvent.keyDown(document, ...)` alone won't set `document.activeElement`.

## Environment gotcha: running gates from a nested worktree

`.claude/worktrees/<name>/` sits INSIDE the main repo's directory tree, so Node's module resolution walks up
and silently uses the OUTER repo's `node_modules` if the worktree has none of its own. This produced FALSE
knip violations (react-dom, tsx, husky, prettier, etc. reported "unused") that did not reproduce when knip was
run from the actual outer repo root, and disappeared once `npm install` was run directly inside the worktree
to give it its own `node_modules` (matching how CI's fresh `npm ci` checkout behaves). Always run
`npm install` inside a fresh worktree before trusting `npm run knip`/lint/typecheck results — don't just rely
on directory walk-up to the parent's install.

## Build gotcha: local secrets missing

A from-scratch worktree has NO `.env*` files. `npm run build` fails collecting `/api/contact` page data with
"Missing API key. Pass it to the constructor `new Resend(...)`" without `RESEND_API_KEY` (and similarly
Upstash/Groq keys) set. Inject dummy values as inline env vars for a local build-gate check
(`RESEND_API_KEY=... UPSTASH_VECTOR_REST_URL=... UPSTASH_VECTOR_REST_TOKEN=... UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=... GROQ_API_KEY=... npm run build`) — CI injects the real secrets per CLAUDE.md.

## Pre-existing unrelated drift noticed (not fixed)

`npm run build` regenerates `public/search-index.json` and it came out with ONE unrelated diff: a blog post's
title lost a trailing period in the index vs. what's currently committed there (frontmatter drift from an
earlier, separate change, unrelated to easter eggs). Reverted it with `git checkout -- public/search-index.json`
before committing rather than smuggling an unrelated content fix into this diff — flag it to review/writer
agents separately if it recurs.
