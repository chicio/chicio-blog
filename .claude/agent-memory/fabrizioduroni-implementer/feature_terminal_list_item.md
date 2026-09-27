---
name: feature_terminal_list_item
description: Shared Presentational Component molecule for a Terminal Chrome "> title" line + dim description, reused by search results and Read Next
type: project
---

Extracted 2026-07-17. `packages/matrix-design-system/src/molecules/terminal-list-item/` —
`TerminalListItem` (`{ title: string; description: string }`), no store (like
`molecules/terminal-progress-bar`, a purely presentational molecule needs no `use-*-store.ts`; the
`folder-composition`/`prefer-component-store` ESLint rules only enforce naming/shape for stores that
exist, they don't mandate one). Renders `<TerminalLine>{">"} {title}</TerminalLine>` +
`<p className="text-primary-text/60 ml-4 line-clamp-1 font-mono text-xs leading-tight">{description}</p>`,
lifted verbatim out of `search-result-item.tsx`'s inline JSX.

Two consumers:
- `SearchResultItem` (command palette, now `apps/website/src/components/features/command-palette/site-command-palette/search-result-item/`) — kept its `Command.Item` + store, delegates inner markup
  to `TerminalListItem`. Pixel-identical, existing tests untouched.
- `RecentPosts` (the Read Next block, `apps/website/src/components/content/blog/blog-post-content/read-next/`) —
  rewritten to wrap each of the 2 `getReadNextPosts()` results in an `InternalLink` (styled
  `no-underline hover:no-underline`, matching `PostCard`'s title-link classes) around a
  `TerminalListItem`. Dropped `PostsRowContainer`/`PostsRow`/`PostCard` for this section only — those
  three stay in use elsewhere (`blog-homepage-content`, `posts-row`), verified via grep before removing
  the Read Next usage. Read Next now shows title + description only (no image, no `PostMeta`, no tags) —
  intentionally matching the search-results Terminal Chrome instead of a full post card.
