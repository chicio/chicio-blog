---
name: Konami/Spoon global-listener easter eggs architecture
description: Pure-logic + store-phase-machine pattern for global keydown easter eggs, the unified tap-hotspot trigger added to kung-fu, and test mocking/lint gotchas
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
- Two new `tracking.action.*` keys: `easter_egg_kung_fu` (renamed from `easter_egg_konami` 2026-07-23 once a
  second, non-keyboard trigger was added — the action represents the egg, not one input method), and
  `easter_egg_spoon`. Labels use the hint ids (`i_know_kung_fu`, `there_is_no_spoon`) under the existing
  `tracking.category.easter_egg_hunt`.
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

## Round 2 (2026-07-23): unified mobile trigger, same egg/component/store

Added a SECOND trigger to the SAME `kung-fu-easter-egg/` component + store (no new egg folder, per explicit
instruction: one egg = one component/store even when it gains a trigger). Key decisions:

- The component now ALWAYS renders an invisible `aria-hidden` `h-11 w-11` (44px, exact Tailwind spacing-scale
  match, no arbitrary value needed) `fixed bottom-0 right-0` hotspot `<div onClick={registerTap}>`, alongside
  the conditionally-rendered `Overlay`. Previously the component returned `null` when inactive — that had to
  change since the hotspot must be mounted on every route regardless of activation state. Gave it
  `data-testid="kung-fu-tap-hotspot"` purely for test querying (aria-hidden elements aren't reachable via
  `getByRole`, so tests must use `getByTestId`).
- Single-fire guard across BOTH triggers: extracted a shared `activate()` callback (guarded by `if (active)
  return` read from the closure, matching the existing dismiss/handleKeyDown convention rather than a
  functional `setState` updater) that both the Konami `matchesKonamiSequence` branch and the tap-threshold
  branch call. This guarantees `trackWith` + `new Audio(...).play()` + `setActive(true)` fire exactly once
  regardless of which trigger completes first, and a second trigger while active is a no-op.
- **Do NOT put the "reached N taps" check in a `useEffect` keyed on a tap-count `useState`.** The React
  Compiler ESLint rule `react-hooks/set-state-in-effect` fires on any synchronous `setState` call in an
  effect body (it does NOT fire on `setState` calls inside a `setTimeout` callback, nor inside a DOM event
  handler like the Konami `handleKeyDown` — only on synchronous-in-effect-body calls). First attempt used
  `const [tapCount, setTapCount] = useState(0)` + a `useEffect` that synchronously called `setTapCount(0)`
  when the threshold was reached — this failed lint. Fixed by moving the ENTIRE counting/threshold/reset-timer
  logic into `registerTap` itself (the click-handler callback), using `useRef` for both the counter
  (`tapCountRef`) and the pending reset timeout handle (`tapResetTimeoutRef`) — no `useEffect` needed for tap
  counting at all, since nothing about tap count needs to be rendered. A separate cleanup-only `useEffect`
  (empty deps) just clears any pending reset timeout on unmount. This is the general fix for
  `set-state-in-effect`: when a piece of derived state is used only to gate a side effect and never rendered,
  do the whole computation in the ref-backed event handler instead of routing it through a `useState`+effect
  round trip.
- Discoverability hint copy for `i_know_kung_fu` extended (dash-free) to describe the corner-tap alternative
  for mobile without removing the Konami description — both live in the same `crypticHint`/`solutionSteps`.
- Existing kung-fu tests: renamed the tracking-action assertion to `easter_egg_kung_fu`, and the "renders
  nothing before Konami" test had to change to "renders the hidden hotspot but no overlay" since the component
  no longer returns `null` when inactive.

## Pre-existing unrelated drift noticed (not fixed)

`npm run build` regenerates `public/search-index.json` and it came out with ONE unrelated diff: a blog post's
title lost a trailing period in the index vs. what's currently committed there (frontmatter drift from an
earlier, separate change, unrelated to easter eggs). Reverted it with `git checkout -- public/search-index.json`
before committing rather than smuggling an unrelated content fix into this diff — flag it to review/writer
agents separately if it recurs. This keeps recurring across unrelated worktree sessions — always
`git status`/`git diff` the search index after any local `build` and revert if the only change is unrelated
content drift.

## Round 3 (2026-07-24): MatrixTerminal + mp3 replaced by a self-hosted autoplay-with-sound video

Kept the SAME `kung-fu-easter-egg/` component/store (still one egg = one folder). Swapped the typed
`MatrixTerminal` + `new Audio("/media/sounds/i-know-kung-fu.mp3")` combo for an extended `SelfHostedVideo`
molecule (`/media/video/i-know-kung-fu.mp4` + poster) that autoplays WITH sound (`autoPlay`, no `muted`) and
keeps native `controls` on as the fallback if a browser blocks unmuted autoplay. `onEnded` now drives
`onComplete`/`isCompleted` (replacing the terminal's `onComplete` callback), and the replay pill resets+replays
the `<video>` via a ref instead of re-playing an `Audio()` object.

- **`SelfHostedVideo` (`src/components/design-system/molecules/video/self-hosted-video/`) gained 4 optional
  props**: `autoPlay?`, `onEnded?`, `videoRef?: (el: HTMLVideoElement | null) => void`, and `ariaLabel?`
  (needed for `aria-label` on the `<video>` — the plan only named 3 props but an accessible name is required
  and there's no other way to set it from outside the molecule; added as a small justified 4th prop, all still
  optional/undefined-default so existing blog MDX `<SelfHostedVideo>` usages are unaffected).
- **`react-hooks/immutability` (React Compiler ESLint rule) fires on mutating a property of a value read from
  `useState`**, even inside a `useCallback` and even when the "value" is a DOM node (mutating `.currentTime`
  on a `[videoEl, setVideoEl] = useState<HTMLVideoElement|null>(null)` triggers
  `Modifying a value returned from 'useState()' ... cannot be modified`). The
  `component-architecture.md` "DOM Refs" convention explicitly allows an alternative to the `useState`
  pattern for element refs: "an internal `useRef` that is never returned." Used that alternative here —
  `const videoElRef = useRef<HTMLVideoElement|null>(null)` plus a `setVideoEl = useCallback((el) => {
  videoElRef.current = el; }, [])` callback ref exposed via effects — because mutating `.current` on a
  `useRef` object is NOT flagged (refs are the compiler's designated escape hatch for mutable non-rendered
  data), whereas the same mutation via `useState`'s value IS flagged. Rule of thumb: if you need to *mutate a
  property* on the held DOM node from an effect/handler (not just read it), reach for `useRef`, not
  `useState`, even though both are listed as acceptable in the convention doc — they are only interchangeable
  for the "hold + attach as `ref=`" use case, not for "later mutate a property of it."
- jsdom's `HTMLMediaElement.prototype.play`/`.load()` throw "Not implemented" by default; stub them with
  `vi.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(...)` (returning a resolved
  Promise) and `.mockImplementation()` for `load` in `beforeAll`, plus `Object.defineProperty(...,
  "currentTime", { get, set })` since jsdom does not implement the property setter either.
- Removed `kungFuTerminalLines` (the `EasterEggTerminalLines`-typed content export) from
  `easter-eggs-content.ts` entirely once the terminal was gone — knip fails otherwise. The `EasterEggTerminalLines`
  type import in that file became unused too and was removed; the type itself is still alive via
  `neo-room-easter-egg` and `command-palette`, so only the LOCAL import in `easter-eggs-content.ts` went away,
  not the type definition in `src/types/search/search.ts`.
