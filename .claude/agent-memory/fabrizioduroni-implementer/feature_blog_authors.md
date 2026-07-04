---
name: feature_blog_authors
description: Authors index + per-author detail pages + Blog nav dropdown (issue #419)
type: project
---

Implemented 2026-07-04 (PR from issue #419). Routes: `/blog/authors` (filterable card
grid, authors with >=1 post only) and `/blog/author/[authorId]` (avatar, name,
role/bio when present, LinkedIn link, reused `BlogGenericPostListPageTemplate` for
posts). Top-nav "Blog" item became a `DropdownMenu` (Latest posts/Authors/Tags/Archive),
mirroring the existing Explore/The Author dropdowns.

**Critical gotcha — server/client module boundary in lib/content/**: `src/lib/content/posts/posts.ts`
transitively imports `fs` via `lib/content/content.ts`. A `"use client"` component that
imports ANYTHING from `posts.ts` (even a pure string-manipulation export) drags the whole
file's import graph into the client bundle and Turbopack fails the build with
`Module not found: Can't resolve 'fs'`. Fix: pure helpers with no fs dependency that a
client component needs (e.g. `authorIdToSlug`/`generateAuthorSlug`) must live in their own
leaf module with zero transitive fs imports (created `lib/content/authors/author-slug.ts`);
`posts.ts` imports/re-exports them for server-side consumers. General rule: before adding
an import from `lib/content/posts|content|tags|videogames|data-structures-and-algorithms`
into any `"use client"` component, check whether that module (or its transitive imports)
touches `fs`/`gray-matter` — vitest/tsc/eslint will NOT catch this, only `next build` does.

**BlogGenericPostListPageTemplate gained `beforeContent?: ReactNode`** (rendered inside
ContentPage, before PageTitle) so the author profile block (avatar/name/role/bio/LinkedIn)
could render above the reused "Posts published (N)" post list without nesting a second
ContentPage/Menu/Footer. Same pattern as `beforeContent`/`afterContent` on
`ReadingContentPage`. Non-breaking optional prop; archive/tag pages unaffected.

**PostAuthors now always links internally** (`/blog/author/[authorId]`) instead of
external LinkedIn, in both post cards and the post byline. Since post-card.tsx wrapped the
whole card body (title+authors+meta+description) in one `<InternalLink to={slug}>`, adding
a second internal link (to the author) inside it would nest `<a>` tags (invalid HTML,
hydration risk). Fixed by splitting that wrapper into two separate `InternalLink`s
(title-only, then meta+description), with `PostAuthors` rendered between them, unwrapped.

**Filter molecule extraction**: `design-system/molecules/form/filter-input/` (props:
`value`, `onChange`, `placeholder?`) replaces the videogames-only `games-filter` — deleted
that folder entirely (no thin wrapper kept) and updated `VideogamesViewSwitcher` to import
`FilterInput` directly. Zero behavior change; ported the exact same render+interaction
tests over.

**Author aggregation lives in `lib/content/posts/posts.ts`** as pure-function pairs so they
unit-test without touching the filesystem, mirroring the pre-existing `rankReadNextPosts`
(pure)/`getReadNextPosts` (fs-backed wrapper) split: `aggregateAuthorsWithPosts(posts)`,
`filterPostsForAuthor(posts, id)`, `findAuthorWithPostsBySlug(posts, slug)` are pure and
tested directly; `getAuthorsWithPosts()`/`getAuthorWithPostsBySlug()` are the thin
`getPosts()`-calling wrappers used by the actual pages (untested, same as `getPosts()`
itself).

**Author.id breaking change**: `Author` gained a required `id` field populated by
`gray-matter.ts` from the frontmatter authors-map key (e.g. `fabrizio_duroni`). The static
`authors` record in `types/content/author.ts` itself stores `AuthorDefinition = Omit<Author, "id">`
(no id) — `id` is only attached at resolution time via `{ ...authors[authorId], id: authorId }`.
Any test that hand-builds an `Author` literal needs `id` added (found via `tsc --noEmit`,
not via lint/tests — grep for `: Author = {` or `Author[] = [{` before assuming done).

**e2e locator gotchas found**: Playwright role-name matching is case-insensitive by
default — the footer's LinkedIn icon has `title="Linkedin"`, so the new profile
`<ExternalLink>LinkedIn</ExternalLink>` needs `{ name: "LinkedIn", exact: true }` to avoid
a strict-mode collision. Author names also appear multiple times per post page (byline +
"Read next" cards), so byline assertions need `.first()`.

**Environment note for this worktree layout**: `.claude/worktrees/<name>/node_modules` can
be nearly empty even though `tsc`/`eslint`/`vitest` still resolve packages by walking up to
the parent repo's `node_modules` — but `knip` does NOT walk up and will falsely report
every dependency as unused/unlisted. Run `npm install` inside the worktree before trusting
`npm run knip` output there. Also: a stale `next-server` process can be left listening on
:3000 from a previous session/worktree and will make Playwright's `reuseExistingServer`
silently attach to STALE markup, producing bizarre unrelated failures (404s on brand-new
routes, missing UI). Always `lsof -i :3000` and kill stragglers before trusting `test:e2e`
results.

See also [[arch_design_system_purity]], [[feature_testing_pyramid]].
