---
name: Command Palette Feature
description: ⌘K command palette with search, quick actions, Easter Egg entry points — architecture and hard-won patterns
type: project
---

## Overview

Originally built at `src/components/design-system/organism/command-palette.tsx`. Now (verified 2026-09-27) split in
two: the generic organism `packages/matrix-design-system/src/organism/command-palette/command-palette/` (published via
the `matrix-design-system/command-palette` entry, state in `src/state/command-palette/`), and the site's composition
`apps/website/src/components/features/command-palette/site-command-palette/` (search results, Terminal item,
Easter Egg Hunt item, customize-matrix-rain item). The patterns below still apply; file names are from the original PR.
Triggered by ⌘K / Ctrl+K or clicking the search pill in the menu bar. PR #298 (`feat/ux-command-palette`).

## Component Architecture

- **State**: `open` (boolean), `isSearching` (boolean — true when ≥3 chars typed)
- **Refs**: `panelShown` — tracks whether panel has been painted in current open session
- **Effects**: Two separate effects — one stable (⌘K + open-event, `[]` deps), one ESC-only-when-open (`[open, close]` deps)
- **No `AnimatePresence`**: Removed because it stalls when `MotionDiv` returns a plain `<div>` (motion OFF). Exit fade of backdrop is lost but close is reliable.
- **Returns null when closed** (early return pattern, no `<>` fragment)

## Key Patterns Established

### MotionDiv Blink Suppression
When `MotionDiv` switches between `motion.div` (motion ON) and plain `<div>` (motion OFF) via `writeMotion`, it's a fresh mount — Framer Motion re-applies `initial` values, causing a visual blink.

**Fix**: Ref that becomes `true` after first commit; pass `initial={ref.current ? false : entryValues}`:
```tsx
// In CommandPalette panel:
const panelShown = useRef(false);
<div ref={(el) => { if (el) panelShown.current = true; }}>
  <MotionDiv initial={panelShown.current ? false : { opacity: 0, scale: 0.95, y: -8 }} ...>

// In Overlay:
const overlayShown = useRef(false);
useLayoutEffect(() => { overlayShown.current = true; }, []);
<MotionDiv initial={overlayShown.current ? false : { opacity: 0 }} ...>
```
`close()` resets `panelShown.current = false` so next open gets the entry animation again.

### Motion Toggle Does NOT Close Palette
`handleToggleMotion` calls `writeMotion()` but NOT `close()`. Reason: `writeMotion` dispatches a custom event, `useSyncExternalStore` subscription fires synchronously causing a re-render race with `close()`. Better UX too — user sees animation toggle take effect live.

### Stable `close` Function
`resetSearch` in `useSearch` is memoized with `useCallback([], [])` (stable since `setSearch` is a stable setter). This lets `close` be wrapped in `useCallback([resetSearch])` → stable reference → ESC effect can list `close` in deps without extra re-registrations.

### `isSearching` Boolean vs `query` String
`isSearching` state only flips when crossing the 3-char threshold. Reduces per-keystroke re-renders to threshold crossings only.

## Search Pill (menu.tsx)

```tsx
<button
    className="ml-auto sm:mr-3 group flex items-center gap-2 px-3 py-1.5 w-44 rounded-lg border border-accent/50 bg-accent/10 hover:border-accent hover:bg-accent/20 transition-all duration-200 cursor-pointer"
    onClick={handlePaletteTrigger}
    aria-label="Open command palette"
>
    <BiSearchAlt className="... group-hover:text-accent ..." />
    <span className="... group-hover:text-accent ...">Search...</span>
    <kbd className="hidden xs:flex ...">⌘K</kbd>  {/* hidden on mobile */}
</button>
```
- `group` on `<button>`, `group-hover:` on children — no extra container `<div>` needed
- Fixed `w-44` on all screen sizes; ⌘K badge hidden on mobile (`hidden xs:flex`)
- Footer keyboard legend also hidden on mobile (`hidden xs:flex`)

## Files Changed (original PR #298; pre-extraction paths)
- `src/components/design-system/organism/command-palette.tsx` — new file (feature)
- `packages/matrix-design-system/src/atoms/effects/overlay/overlay.tsx` — added `className` prop + blink-suppression ref
- `packages/matrix-design-system/src/organism/menu/menu.tsx` — replaced old inline search with pill trigger
- `src/components/design-system/utils/hooks/use-search.ts` (now `apps/website/src/components/features/search/use-search.ts`) — memoized `resetSearch`, removed `console.log`

## Tracking Events Used
- `tracking.action.command_palette_open`
- `tracking.action.command_palette_toggle_motion`
- `tracking.action.command_palette_open_chat`
- `tracking.action.command_palette_search_result_selected`
