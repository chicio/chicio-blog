# Videogames Navigation & Tab Persistence Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable context-aware back navigation on the videogames game page and persist the selected tab on the videogames listing page.

**Architecture:** A small client component (`GameBreadcrumb`) reads navigation origin from sessionStorage to render dynamic breadcrumbs. `GameCard` writes the origin on click. `VideogamesViewSwitcher` persists the selected tab to localStorage and reads it on mount. New sessionStorage helpers mirror the existing localStorage pattern.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-10-videogames-navigation-design.md`

---

## Chunk 1: Foundation — shared type and sessionStorage helpers

### Task 1: Add `VideogamesNavigationOrigin` type

**Files:**
- Modify: `src/types/content/videogames.ts:30` (append after `GameMetadata`)

- [ ] **Step 1: Add the type**

Add at the end of `src/types/content/videogames.ts`:

```typescript
export type VideogamesNavigationOrigin = "all-games" | "console";
```

- [ ] **Step 2: Verify lint passes**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/types/content/videogames.ts
git commit -m "feat(ux): :sparkles: add VideogamesNavigationOrigin type"
```

### Task 2: Create sessionStorage helpers

**Files:**
- Create: `src/lib/session-storage/session-storage.ts`
- Reference: `src/lib/local-storage/local-storage.ts` (mirror this pattern exactly)

- [ ] **Step 1: Create the helper file**

Create `src/lib/session-storage/session-storage.ts`:

```typescript
const prefix = "fabrizioduroni_";

export const readSessionStorage = (key: string) => {
  return sessionStorage.getItem(`${prefix}${key}`);
};

export const writeSessionStorage = (key: string, value: string) => {
  sessionStorage.setItem(`${prefix}${key}`, value);
};
```

- [ ] **Step 2: Verify lint passes**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/session-storage/session-storage.ts
git commit -m "feat(ux): :sparkles: add sessionStorage helpers"
```

---

## Chunk 2: Tab persistence in VideogamesViewSwitcher

### Task 3: Persist selected tab to localStorage

**Files:**
- Modify: `src/components/sections/videogames/components/videogames-view-switcher.tsx`

The current code at line 63:
```typescript
const [activeView, setActiveView] = useState<View>("consoles");
```

And the handler at lines 69-72:
```typescript
const handleViewChange = (view: View) => {
    resetFilter();
    setActiveView(view);
};
```

- [ ] **Step 1: Add imports**

Add to existing imports in `videogames-view-switcher.tsx`:

```typescript
import { useEffect } from "react";
```

(Add `useEffect` to the existing `memo, useState` import from React at line 3.)

Also add:

```typescript
import { readLocalStorage, writeLocalStorage } from "@/lib/local-storage/local-storage";
```

- [ ] **Step 2: Add useEffect to read localStorage on mount**

After the `useState` line (line 63), add:

```typescript
useEffect(() => {
    const saved = readLocalStorage("videogames_view");
    if (saved === "consoles" || saved === "games") {
        setActiveView(saved);
    }
}, []);
```

- [ ] **Step 3: Write to localStorage on tab change**

Update `handleViewChange` (lines 69-72) to:

```typescript
const handleViewChange = (view: View) => {
    resetFilter();
    setActiveView(view);
    writeLocalStorage("videogames_view", view);
};
```

- [ ] **Step 4: Verify it works**

Run: `npm run dev`
- Navigate to `/videogames`
- Switch to "All Games" tab
- Refresh the page
- Expected: "All Games" tab is still selected

- [ ] **Step 5: Verify lint and build**

Run: `npm run lint && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/videogames/components/videogames-view-switcher.tsx
git commit -m "feat(ux): :sparkles: persist videogames tab selection in localStorage"
```

---

## Chunk 3: Navigation origin tracking in GameCard

### Task 4: Add `navigationOrigin` prop to GameCard and write to sessionStorage

**Files:**
- Modify: `src/components/sections/videogames/components/game-card.tsx`

Current `GameCard` structure (lines 13-70): the entire card content is inside a `<StandardInternalLinkWithTracking>` wrapped in a `<div ref={ref}>`.

- [ ] **Step 1: Add imports**

Add to `game-card.tsx`:

```typescript
import { VideogamesNavigationOrigin } from "@/types/content/videogames";
import { writeSessionStorage } from "@/lib/session-storage/session-storage";
```

- [ ] **Step 2: Update interface and add click handler**

Replace the current interface and component signature (lines 13-18):

```typescript
interface GameCardProps {
  game: Content<GameMetadata>;
}

export const GameCard: FC<GameCardProps> = ({ game }) => {
```

With:

```typescript
interface GameCardProps {
  game: Content<GameMetadata>;
  navigationOrigin?: VideogamesNavigationOrigin;
}

export const GameCard: FC<GameCardProps> = ({ game, navigationOrigin = "console" }) => {
```

- [ ] **Step 3: Add onClick handler to the outer div**

The outer `<div>` at line 21 currently is:

```tsx
<div
  ref={ref}
  className="glow-container relative h-80 w-full overflow-hidden rounded-lg shadow-lg"
  key={game.frontmatter.title}
>
```

Add an `onClick` handler:

```tsx
<div
  ref={ref}
  className="glow-container relative h-80 w-full overflow-hidden rounded-lg shadow-lg"
  key={game.frontmatter.title}
  onClick={() => writeSessionStorage("videogames_navigation_origin", navigationOrigin)}
>
```

- [ ] **Step 4: Verify lint and type check**

Run: `npm run lint && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/videogames/components/game-card.tsx
git commit -m "feat(ux): :sparkles: write navigation origin to sessionStorage on GameCard click"
```

### Task 5: Pass `navigationOrigin` from VideogamesViewSwitcher and GameGrid

**Files:**
- Modify: `src/components/sections/videogames/components/games-grid.tsx`
- Modify: `src/components/sections/videogames/components/videogames-view-switcher.tsx`

The `GameGrid` component (lines 10-15 of `games-grid.tsx`) renders `GameCard` without `navigationOrigin`. It needs to accept and forward the prop.

The `VideogamesViewSwitcher` renders `<GameGrid>` at line 92 inside the "All Games" tab. It needs to pass `navigationOrigin="all-games"`.

- [ ] **Step 1: Update GameGrid to accept and forward navigationOrigin**

In `src/components/sections/videogames/components/games-grid.tsx`, update the interface and component:

Replace the current code (lines 1-15):

```typescript
import { Content } from "@/types/content/content";
import { GameMetadata } from "@/types/content/videogames";
import { FC } from "react";
import { GameCard } from "./game-card";

interface GamesGridProps {
  games: Content<GameMetadata>[];
}

export const GameGrid: FC<GamesGridProps> = ({ games }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    {games.length > 0 &&
      games.map((game) => <GameCard key={game.slug.formatted} game={game} />)}
  </div>
);
```

With:

```typescript
import { Content } from "@/types/content/content";
import { GameMetadata, VideogamesNavigationOrigin } from "@/types/content/videogames";
import { FC } from "react";
import { GameCard } from "./game-card";

interface GamesGridProps {
  games: Content<GameMetadata>[];
  navigationOrigin?: VideogamesNavigationOrigin;
}

export const GameGrid: FC<GamesGridProps> = ({ games, navigationOrigin }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    {games.length > 0 &&
      games.map((game) => <GameCard key={game.slug.formatted} game={game} navigationOrigin={navigationOrigin} />)}
  </div>
);
```

- [ ] **Step 2: Pass `navigationOrigin` from VideogamesViewSwitcher**

In `videogames-view-switcher.tsx`, the `FilteredGameGrid` memo component (lines 19-30) renders `<GameGrid>`. Update it to pass `navigationOrigin`.

Replace lines 19-30:

```typescript
const FilteredGameGrid = memo(
    ({ games, query }: { games: Content<GameMetadata>[]; query: string; isPending: boolean }) =>
        games.length > 0 ? (
            <GameGrid games={games} />
        ) : (
            <div className="text-secondary flex flex-col items-center gap-3 py-16">
                <IoGameControllerOutline className="text-accent text-shadow-lg size-12" />
                <p className="text-accent text-shadow-lg">No games found for &ldquo;{query}&rdquo;.</p>
            </div>
        ),
    (_, next) => next.isPending,
);
```

With:

```typescript
const FilteredGameGrid = memo(
    ({ games, query }: { games: Content<GameMetadata>[]; query: string; isPending: boolean }) =>
        games.length > 0 ? (
            <GameGrid games={games} navigationOrigin="all-games" />
        ) : (
            <div className="text-secondary flex flex-col items-center gap-3 py-16">
                <IoGameControllerOutline className="text-accent text-shadow-lg size-12" />
                <p className="text-accent text-shadow-lg">No games found for &ldquo;{query}&rdquo;.</p>
            </div>
        ),
    (_, next) => next.isPending,
);
```

Note: The `Console` component at `console.tsx:71` also renders `<GameGrid games={games} />` — it does NOT pass `navigationOrigin`, so the default `"console"` is used. No change needed there.

- [ ] **Step 3: Verify lint and type check**

Run: `npm run lint && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/videogames/components/games-grid.tsx src/components/sections/videogames/components/videogames-view-switcher.tsx
git commit -m "feat(ux): :sparkles: pass navigation origin through GameGrid to GameCard"
```

---

## Chunk 4: Dynamic breadcrumb on game page

### Task 6: Create GameBreadcrumb client component

**Files:**
- Create: `src/components/sections/videogames/components/game-breadcrumb.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/sections/videogames/components/game-breadcrumb.tsx`:

```tsx
"use client";

import { FC, useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import { tracking } from "@/types/configuration/tracking";
import { slugs } from "@/types/configuration/slug";
import { readSessionStorage } from "@/lib/session-storage/session-storage";
import { VideogamesNavigationOrigin } from "@/types/content/videogames";

interface GameBreadcrumbProps {
    gameTitle: string;
    gameSlug: string;
    consoleName: string;
    consoleSlug: string;
}

const videogamesBreadcrumb: BreadcrumbItem = {
    label: "Videogames",
    href: slugs.videogames.home,
    isCurrent: false,
    trackingData: {
        action: tracking.action.open_videogame_collection,
        category: tracking.category.videogames,
        label: tracking.label.body,
    },
};

const buildBreadcrumbItems = (
    origin: VideogamesNavigationOrigin | null,
    gameTitle: string,
    gameSlug: string,
    consoleName: string,
    consoleSlug: string,
): BreadcrumbItem[] => {
    const currentItem: BreadcrumbItem = {
        label: gameTitle,
        href: gameSlug,
        isCurrent: true,
    };

    if (origin === "all-games") {
        return [videogamesBreadcrumb, currentItem];
    }

    return [
        videogamesBreadcrumb,
        {
            label: consoleName,
            href: consoleSlug,
            isCurrent: false,
            trackingData: {
                action: tracking.action.open_videogame_console,
                category: tracking.category.videogames,
                label: tracking.label.body,
            },
        },
        currentItem,
    ];
};

export const GameBreadcrumb: FC<GameBreadcrumbProps> = ({
    gameTitle,
    gameSlug,
    consoleName,
    consoleSlug,
}) => {
    const [origin, setOrigin] = useState<VideogamesNavigationOrigin | null>(null);

    useEffect(() => {
        const saved = readSessionStorage("videogames_navigation_origin");
        if (saved === "all-games" || saved === "console") {
            setOrigin(saved);
        }
    }, []);

    const items = buildBreadcrumbItems(origin, gameTitle, gameSlug, consoleName, consoleSlug);

    return <Breadcrumb items={items} />;
};
```

- [ ] **Step 2: Verify lint and type check**

Run: `npm run lint && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/videogames/components/game-breadcrumb.tsx
git commit -m "feat(ux): :sparkles: add GameBreadcrumb client component with dynamic origin"
```

### Task 7: Wire GameBreadcrumb into Game server component

**Files:**
- Modify: `src/components/sections/videogames/components/game.tsx`

The `Game` component currently passes `breadcrumbs` to `ReadingContentPageTemplate` at lines 42-70. We replace that with `beforeContent` containing `<GameBreadcrumb />`.

- [ ] **Step 1: Add import**

Add to `game.tsx` imports:

```typescript
import { GameBreadcrumb } from "./game-breadcrumb";
```

- [ ] **Step 2: Replace breadcrumbs prop with beforeContent**

In `game.tsx`, replace the `ReadingContentPageTemplate` opening tag and its `breadcrumbs` prop (lines 39-71):

```tsx
    <ReadingContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.videogames}
      breadcrumbs={
        [
          {
            label: "Videogames",
            href: slugs.videogames.home,
            isCurrent: false,
            trackingData: {
              action: tracking.action.open_videogame_collection,
              category: tracking.category.videogames,
              label: tracking.label.body,
            },
          },
          {
            label: console.frontmatter.metadata!.name,
            href: console.slug.formatted,
            isCurrent: false,
            trackingData: {
              action: tracking.action.open_videogame_console,
              category: tracking.category.videogames,
              label: tracking.label.body,
            },
          },
          {
            label: game.frontmatter.title,
            href: game.slug.formatted,
            isCurrent: true,
          },
        ] satisfies BreadcrumbItem[]
      }
    >
```

With:

```tsx
    <ReadingContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.videogames}
      beforeContent={
        <GameBreadcrumb
          gameTitle={game.frontmatter.title}
          gameSlug={game.slug.formatted}
          consoleName={console.frontmatter.metadata!.name}
          consoleSlug={console.slug.formatted}
        />
      }
    >
```

- [ ] **Step 3: Clean up unused imports**

Remove the now-unused imports from `game.tsx`:

- Remove `BreadcrumbItem` from imports (line 2): `import { BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";`
- Remove `slugs` import (line 14): `import { slugs } from "@/types/configuration/slug";`

Verify these are not used elsewhere in the file. `tracking` is still used for `VideogameNavigation`, so keep it. `slugs` is not used elsewhere in `game.tsx` after removing the breadcrumbs — confirm by checking the rest of the file.

- [ ] **Step 4: Verify lint and type check**

Run: `npm run lint && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Manual verification**

Run: `npm run dev`

Test Flow 1 (All Games origin):
1. Go to `/videogames`, click "All Games" tab
2. Click any game
3. Expected breadcrumb: `Videogames > [Game Title]`
4. Press browser back
5. Expected: "All Games" tab is selected

Test Flow 2 (Console origin):
1. Go to `/videogames`, click a console, then click a game
2. Expected breadcrumb: `Videogames > [Console Name] > [Game Title]`

Test Flow 3 (Direct URL):
1. Open a game URL directly in a new tab
2. Expected breadcrumb: `Videogames > [Console Name] > [Game Title]` (default)

Test Flow 4 (Prev/next):
1. From Flow 1, click next game pill
2. Expected breadcrumb: still `Videogames > [Game Title]` (origin preserved)

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: build succeeds with no errors

- [ ] **Step 7: Commit**

```bash
git add src/components/sections/videogames/components/game.tsx
git commit -m "feat(ux): :sparkles: wire dynamic GameBreadcrumb into game page"
```
