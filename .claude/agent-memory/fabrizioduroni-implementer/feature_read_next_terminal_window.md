---
name: feature_read_next_terminal_window
description: ReadNextTerminalWindow client shell wraps read-next rows in command-palette-style terminal chrome
type: project
---

Added 2026-07-17, follow-up to [[feature_terminal_list_item]]. `read-next.tsx` (`RecentPosts`) stays a
server component (reads `getReadNextPosts` via filesystem). Since glassmorphism chrome needs the client
`useGlassmorphism` hook, added a private nested child (used by exactly 1 consumer, per the
component-architecture placement rule):
`src/components/content/blog/blog-post-content/read-next/read-next-terminal-window/` —
`ReadNextTerminalWindow` (`"use client"`, props `{ title: string; children: ReactNode }`). Stateless —
only calls `useGlassmorphism({ noScale: true })` directly (the permanent one-hook exception), no store
file needed.

Chrome mirrors `CommandPalette` (`src/components/design-system/organism/command-palette/command-palette/`)
almost verbatim but static (no cmdk, no input, no animation):
- outer `${glassmorphismClass} overflow-hidden` div
- header row `border-accent/20 flex items-center gap-2 border-b px-4 py-3` with an accent bold `>` span
  identical to the palette prompt, followed by an `<h2>` for the title — this is the ONLY heading, doing
  double duty as visible terminal prompt text and semantic section heading (no sr-only duplication). The
  global `h2` base-layer rule (`text-accent font-bold text-shadow-md text-3xl sm:text-4xl leading-normal
  mt-4` in `src/app/css/globals.css`) is overridden by later utility classes (`m-0 font-mono text-sm`)
  because Tailwind v4 puts `@layer base` below the utilities layer regardless of source order — same
  pattern the old code already relied on (`className="my-2"` overriding `mt-4`).
- body `px-4 py-2` wrapping `{children}` (the existing per-post rows)
- footer hint bar `border-accent/20 text-accent/40 border-t px-4 py-2 font-mono text-xs` with a single
  `↵ open` hint (palette's footer has 3 hints; read-next only needs 1 since there's no keyboard nav)

`read-next.tsx` render changed from `<div className="my-12"><h2>Read next</h2><div className="flex
flex-col gap-3">{rows}</div></div>` to `<div className="my-12"><ReadNextTerminalWindow title="read
next">{rows}</ReadNextTerminalWindow></div>` — heading text is now lowercase "read next" to read as a
command. Updated `read-next.test.tsx` heading assertion text and `e2e/blog.spec.ts`'s read-next locator:
the h2's parent is now the header row div (not the whole window), so the locator climbing from the
heading to find sibling links needed `.locator("../..")` instead of `.locator("..")` to reach the outer
window that contains the body with the `<a>` tags.
