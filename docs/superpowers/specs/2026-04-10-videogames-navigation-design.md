# Videogames Navigation & Tab Persistence — Design Spec

## Problem

The videogames section has two navigation issues:

1. **Game page breadcrumbs are static**: Always show `Videogames > [Console] > [Game]` regardless of how the user arrived. Users coming from the "All Games" tab see a console-level breadcrumb that doesn't match their navigation flow.
2. **Tab selection is not persisted**: The view switcher on `/videogames` (By Console / All Games) resets to "By Console" on every visit. Users pressing back from a game page lose their tab selection.

## Solution — Approach A: Client-only breadcrumb wrapper

Minimal changes: a new client component for dynamic breadcrumbs, sessionStorage for navigation origin tracking, localStorage for tab persistence.

### Constraints

- `Game` component must remain a server component
- `ReadingContentPageTemplate` must not be modified
- `Breadcrumb` component must not be modified
- URL must stay clean (no query parameters for origin tracking)

## Design

### 0. Shared type and sessionStorage helpers

**New type** in `src/types/content/videogames.ts`:

```typescript
type VideogamesNavigationOrigin = "all-games" | "console";
```

Shared by `GameCard` (writes) and `GameBreadcrumb` (reads), ensuring type safety across the sessionStorage boundary.

**New file** `src/lib/session-storage/session-storage.ts` — analogous to the existing `src/lib/local-storage/local-storage.ts`:

```typescript
const prefix = "fabrizioduroni_";

export const readSessionStorage = (key: string) => {
  return sessionStorage.getItem(`${prefix}${key}`);
};

export const writeSessionStorage = (key: string, value: string) => {
  sessionStorage.setItem(`${prefix}${key}`, value);
};
```

### 1. Tab persistence with localStorage

**Component**: `VideogamesViewSwitcher`

- **Key**: `videogames_view` (prefixed automatically by `writeLocalStorage`)
- **Values**: `"consoles"` | `"games"`
- **On tab change**: write the selected value to localStorage via `writeLocalStorage`
- **On init**: `useState("consoles")` as initial value (SSR-safe), then `useEffect` on mount reads from localStorage via `readLocalStorage` and updates the state if different. This avoids React hydration mismatch since `VideogamesViewSwitcher` is a client component rendered inside a server component page.

No new components. Only modification to `VideogamesViewSwitcher`.

### 2. Navigation origin tracking with sessionStorage

**Key**: `videogames_navigation_origin` (prefixed automatically by `writeSessionStorage`)

**Values**: `VideogamesNavigationOrigin` (`"all-games"` | `"console"`)

**Writing the origin:**

`GameCard` receives a new optional prop:

```typescript
navigationOrigin?: VideogamesNavigationOrigin
```

Default: `"console"`.

**Click interception mechanism**: `GameCard` wraps its existing `StandardInternalLinkWithTracking` content in an outer `<div onClick={...}>`. The outer div's `onClick` fires before the inner `Link` navigates, writing the origin to sessionStorage via `writeSessionStorage`. This avoids modifying the shared `StandardInternalLinkWithTracking` atom — it keeps its existing `onClick` for GA tracking untouched.

**Callers:**

- `VideogamesViewSwitcher` passes `navigationOrigin="all-games"` when rendering `GameCard` in the "All Games" tab
- Console detail page passes `"console"` (or relies on the default)

### 3. Dynamic breadcrumb on game page

**New client component**: `GameBreadcrumb`

**File**: `src/components/sections/videogames/components/game-breadcrumb.tsx`

**Props:**

```typescript
interface GameBreadcrumbProps {
  gameTitle: string;
  gameSlug: string;
  consoleName: string;
  consoleSlug: string;
}
```

**Internal composition**: `GameBreadcrumb` imports and renders the existing `<Breadcrumb items={...} />` component from `@/components/design-system/molecules/breadcrumbs/breadcrumb`. It constructs the `BreadcrumbItem[]` array dynamically based on the sessionStorage origin value.

**Behavior:**

- On mount, reads sessionStorage via `readSessionStorage("videogames_navigation_origin")`
- If `"all-games"`: renders `<Breadcrumb>` with items `[Videogames, Game Title (current)]`
- If `"console"` or absent: renders `<Breadcrumb>` with items `[Videogames, Console Name, Game Title (current)]` (current default)
- SSR / first render: shows the default breadcrumb (with console). Updates on mount only if origin is `"all-games"`. Flash is negligible since mount is immediate and default breadcrumb is always valid.

**Integration with `Game` server component:**

- `Game` no longer passes `breadcrumbs` prop to `ReadingContentPageTemplate`
- Instead, passes `<GameBreadcrumb ... />` via the existing `beforeContent` prop
- Visual ordering is preserved: when `breadcrumbs` is omitted, the template skips the breadcrumb slot (`{breadcrumbs && <Breadcrumb>}`), and `beforeContent` renders immediately after — same visual position as before
- `ReadingContentPageTemplate` is NOT modified

## Files changed

| File | Change |
|------|--------|
| `src/components/sections/videogames/components/videogames-view-switcher.tsx` | Read/write localStorage for tab (useEffect pattern); pass `navigationOrigin="all-games"` to `GameCard` |
| `src/components/sections/videogames/components/game-card.tsx` | New `navigationOrigin` prop; outer div onClick writes to sessionStorage |
| `src/components/sections/videogames/components/game.tsx` | Move breadcrumb from `breadcrumbs` to `beforeContent` using `<GameBreadcrumb />` |
| `src/types/content/videogames.ts` | Add `VideogamesNavigationOrigin` type |

## Files created

| File | Purpose |
|------|---------|
| `src/components/sections/videogames/components/game-breadcrumb.tsx` | Client component: reads sessionStorage, composes `<Breadcrumb items={...} />` dynamically |
| `src/lib/session-storage/session-storage.ts` | `readSessionStorage` / `writeSessionStorage` helpers with `fabrizioduroni_` prefix |

## Files NOT touched

- `ReadingContentPageTemplate` — unchanged
- `Breadcrumb` — unchanged
- `StandardInternalLinkWithTracking` — unchanged
- `Console` component — unchanged (GameCards on console page use default `"console"`)

## Edge cases & trade-offs

### Stale sessionStorage on direct URL navigation

If a user navigates from "All Games" to a game (sessionStorage = `"all-games"`), then later types a different game URL directly in the same tab, the stale origin persists and they get the "All Games" breadcrumb instead of the default. This is acceptable because:

- Direct URL entry in an existing tab is a rare edge case
- Any subsequent link-based navigation (from GameCard) overwrites the origin correctly
- The fallback breadcrumb is always valid — it just might not match the "ideal" path

### Prev/next navigation preserves origin

`VideogameNavigation` uses `BluePillLink`/`RedPillLink` (not `GameCard`), so it does NOT write to sessionStorage. The origin from the original click is preserved across prev/next navigation within the same tab session.

### New tab / bookmark

Opening a game link in a new tab or from a bookmark means sessionStorage is empty. The default breadcrumb (with console) is shown — a safe and correct fallback.

## User flows

### Flow 1: User browses "All Games" → clicks a game → presses back

1. User on `/videogames`, selects "All Games" tab → localStorage saves `"games"`
2. Clicks a game → sessionStorage saves `"all-games"`, navigates to game page
3. Game page breadcrumb: `Videogames > [Game Title]`
4. User presses back → returns to `/videogames`, tab restored to "All Games" from localStorage

### Flow 2: User browses console → clicks a game

1. User on `/videogames/console/[console]`, clicks a game in the grid
2. sessionStorage saves `"console"`, navigates to game page
3. Game page breadcrumb: `Videogames > [Console Name] > [Game Title]` (same as current)

### Flow 3: Direct link / new tab / bookmark

1. No sessionStorage origin available
2. Game page breadcrumb: `Videogames > [Console Name] > [Game Title]` (default fallback)

### Flow 4: Prev/next game navigation

1. User on game page, clicks prev/next pill button
2. `VideogameNavigation` does not use `GameCard`, so no sessionStorage write occurs
3. Origin in sessionStorage is preserved from the original navigation
4. Breadcrumb stays consistent with the original navigation flow
