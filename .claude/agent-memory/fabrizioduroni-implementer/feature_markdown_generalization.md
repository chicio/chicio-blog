---
name: feature_markdown_generalization
description: markdownDocument/mdxPageMarkdown/contactMarkdown lib helpers that generalized every /markdown generator (2026-07-23); rehype-figure title-dedup gotcha; art/cookie-policy MDX migrations
type: project
---

## Overview

2026-07-23, alongside the terminal shareable-URL work ([[feature_terminal_navigation]]): generalized the
`/markdown/[[...path]]` content-negotiation generators (see [[feature_markdown_negotiation]]) behind two new
`src/lib/mdx/` helpers, then used them to give `art`, `cookie-policy`, and `mcp` real markdown views (previously
404/"unavailable" in both the AI-facing endpoint and the terminal overlay), plus a `contact` generator.

- **`markdownDocument({ title, description, slug, body })`** (`src/lib/mdx/markdown-document.ts`) — the shared
  header (`# title` / `> description` / `**URL:** ...` / `---` / body). Every existing generator (posts, DSA,
  videogames, blog-stats, easter-egg-hunt) was refactored to route through it — clean sweep, ~8 files. Where a
  generator previously had extra inline metadata line(s) (Author/Date/Tags, Difficulty/Technique/LeetCode,
  Manufacturer/ReleaseYear/Generation, ...) sitting BEFORE the URL line, those moved into `body` (right after the
  canonical header, before the actual content) rather than growing the shared header shape per page. Generators
  that previously had NO `---` separator or NO blockquote description gained both, to converge on one canonical
  shape — a deliberate, approved formatting change, not a bug.
- **`mdxPageMarkdown(slug)`** (`src/lib/mdx/mdx-page-markdown.ts`) — generic for any page backed by a standard
  `src/content/<slug>/content.mdx`. `about-me-markdown.ts` was DELETED entirely (about-me now collapses to
  `mdxPageMarkdown(slugs.aboutMe)` called directly from route.ts's registry — no bespoke file needed).
- **`contactMarkdown()`** (`src/lib/content/contact/contact-markdown.ts`) — the one deliberate NON-mdxPageMarkdown
  page: contact has no `content.mdx` (would duplicate `siteMetadata.contacts`, which already drives the form/
  footer/SEO). Builds email + all social links straight from that config through `markdownDocument`.
- **route.ts registry**: `MDX_PAGE_SLUGS = new Set([aboutMe, mcp, cookiePolicy, art])` checked BEFORE the
  existing switch (not as switch cases) — a `contact` case was added to the switch alongside the others.

## Critical gotcha: leading-H1 duplication for pages whose MDX body already has its own `# Title`

`TerminalContentBlock` (the terminal's in-shell content renderer) does NOT render its own heading from the
manifest node's `title` — it renders ONLY the fetched markdown body via the `Markdown` atom. So the visible H1
is whatever's the first `# ...` line in the fetched `/markdown/<route>` text.

Pages like `about-me` (content.mdx starts with `## Biography`, no H1 at all — ReadingContentPage/ContentPage
never render a title of their own) are fine: `markdownDocument`'s canonical `# {title}` is the ONLY H1.

But `mcp` and the new `cookie-policy` content.mdx files legitimately open their body with their OWN `# Title`
(needed for the real page's accessible H1, since neither ReadingContentPage nor ContentPage render one). Once
piped through `mdxPageMarkdown`, that produces the canonical header's `# {title}` FOLLOWED by the body's
IDENTICAL `# {title}` a second time — a real, visible duplicate-H1 defect in the generated `/markdown/mcp` and
`/markdown/cookie-policy` output (confirmed by inspecting the actual `.next/server/app/markdown/*.body` files
after a real build, not just unit tests), and the proximate cause of 2 Playwright strict-mode "resolved to 2
elements" failures when first writing e2e coverage for these pages.

**Fix**: `mdxPageMarkdown` strips a single leading `# {frontmatter.title}` heading from the mdxToMarkdown'd body
before handing it to `markdownDocument`, via a small `stripLeadingTitleHeading(markdown, title)` string check
(exact match on `# {title}\n` at the very start) — surgical and scoped to this one duplication case, doesn't
touch the shared/tested `mdxToMarkdown` AST pipeline. A body that doesn't open with that exact heading (about-me)
is left untouched. Any FUTURE page wired through `mdxPageMarkdown` whose content.mdx opens with its own `# Title`
gets this dedup for free — no per-page special-casing needed.

## Art migration: `src/content/art/art.ts` → `content.mdx`, gallery reworked around MDX component overrides

- Content: the 49 `artDescriptions` entries became one `![caption](/media/content/art/<name>)` markdown image
  line each (order + captions preserved verbatim), in `src/content/art/content.mdx` with standard frontmatter.
  **Found a pre-existing, out-of-scope content gap while doing this**: `src/content/art/media/` has 97 image
  files on disk but `art.ts` only had descriptions for 49 of them — 48 images (mostly 2020-2022 dates) have NO
  gallery entry at all and were silently invisible on the old page too. Not touched (editorial curation, not a
  code task) but worth flagging to the site owner.
- **`@microflash/rehype-figure` (next.config.ts rehype pipeline) wraps EVERY standalone `![alt](src)` image in
  `<figure><img/><figcaption>{alt}</figcaption></figure>` at build time, unwrapping any `<p>` that contained only
  the image** (confirmed by reading the plugin's actual source, `node_modules/@microflash/rehype-figure/index.js`:
  a `hasOnlyImages` visitor removes the wrapping paragraph BEFORE a second visitor wraps every alt+src image in a
  fresh `<figure>`). This means a design-doc/spec instruction to "override the MDX `p` component to unwrap a
  lone image" is **factually wrong for this codebase's real pipeline** — there is no surviving `<p>` to override;
  the real wrapper is `<figure>`, confirmed by the pre-existing `#reading-content-container figure figcaption` /
  `figure img` rules already in `globals.css`. The correct override target is `figure` (drop the redundant
  `<figcaption>`, keep only the image element, since the gallery card already shows its own caption from `alt`).
  **When a plan's stated internal mechanism (which HTML tag wraps X) conflicts with what you can verify by
  reading the actual dependency's source and the codebase's existing CSS, trust the verified mechanism and
  implement the equivalent END RESULT the plan wanted — flag the substitution, don't silently follow a wrong
  literal instruction.**
- **Modal state → React Context, first use of `createContext` in this codebase.** `ArtGalleryContext`
  (`{ selectImage }`) lives as a loose `.ts` file directly in the shared `art-gallery/` namespace folder (mirrors
  the `nav-config.ts` precedent in `features/content/` — a plain shared module sibling to component folders,
  imported via relative path, not a barrel). `ArtGalleryProvider` (owns `useState` for `currentImage`, renders the
  grid wrapper div + `<ArtGalleryContext.Provider>` + conditional `<ModalWithImage>`) is the ONE store-owning
  component; `ArtGalleryImage` (the `img` override) has its own tiny store whose ONLY job is
  `useContext(ArtGalleryContext)` — because `chicio/prefer-component-store` flags ANY `use[A-Z]*` call in a
  component `.tsx` file that isn't its own store hook or `useGlassmorphism`, `useContext` **cannot** be called
  directly in the component; it must be wrapped inside `use-<name>-store.ts` like any other hook.
- `ArtGalleryFigure` (the `figure` override) and `ArtGalleryImage` are compared by **identity** (`child.type ===
  ArtGalleryImage`) to detect "this figure wraps our own gallery-card image" vs. a hypothetical non-image figure —
  simple, no prop-shape guessing needed since we control both overrides.
- Dropped the per-index `delay: i * 0.08` motion stagger (an `img`-override component has no `index` prop from
  MDX) in favor of a flat `duration: 0.4` fade — explicitly sanctioned as cosmetic-only in the plan.
- MDX component overrides passed as `components={{ img: ArtGalleryImage, figure: ArtGalleryFigure }}` to
  `<ArtContent components={...} />` DO override the ambient global `img` mapping from `src/mdx-components.tsx`
  (that file's exported `img` becomes `_provideComponents().img`, spread BEFORE `props.components` in the
  compiled `_createMdxContent`, so an explicit `components` prop always wins for that render).

## Cookie-policy migration: hardcoded JSX prose → `content.mdx`

Straightforward faithful markdown conversion (headings, lists, one external link) of the JSX in the old
`src/app/cookie-policy/page.tsx`, rendered through a new `CookiePolicy` component (`ReadingContentPage` pattern,
mirroring `McpPage`) instead of raw `ContentPage` + inline JSX. Cleaned up two literal soft-hyphen artifacts
("third­parties", "third­party" — stray `­` chars from the original copy-paste) into plain "third parties" /
"third party" while converting; a legitimate copyedit, not a content change.

## Testing pattern for MDX-driven page components (no MDX loader in Vitest)

Vitest has NO `.mdx` transform configured — `vi.mock("@/content/art/content.mdx", () => ({ default: FakeComponent
}))` (a hand-written `FC` accepting the same `components` prop the real `.mdx` import would receive) is the
correct/only way to test a component that imports a real `.mdx` file, confirmed against the design doc's own
"render with a small mocked MDX" instruction. Combine with `ContentPage`/`ReadingContentPage` mocked to a
`children`-only passthrough (established precedent already used by `blog-stats.test.tsx`, `blog-author.test.tsx`,
etc. — NOT a new pattern) to sidestep needing real Next.js routing/menu context. `vi.hoisted()` is required to
define the fake MDX component before the hoisted `vi.mock()` call references it (same gotcha as
[[feature_testing_pyramid]]).

## Prettier pitfall: raw CLI `prettier --write` reformats to 2-space, breaking this repo's 4-space convention

`.prettierrc` has no `tabWidth`, so Prettier's own default (2) applies to a raw `npx prettier --write <file>` CLI
invocation — but this repo's actual 4-space convention (confirmed via `git show HEAD:<file>` on an untouched file)
is produced by the VS Code Prettier extension falling back to `editor.tabSize` (VS Code's own default is 4) when
`.prettierrc` doesn't specify one — an editor-extension-only behavior the raw CLI does not replicate. There is
also no `format`/`prettier` npm script and no ESLint-Prettier integration in this repo — Prettier is a
devDependency used only for the `prettier-plugin-tailwindcss` class-sorting plugin via editor tooling, not a CLI
gate. **Never run `npx prettier --write` on a file in this repo to fix formatting** — it silently reformats to
2-space and must be manually reverted to 4-space. Fix indentation/reflow by hand (or accept ESLint's `--fix`,
which does not touch indentation width) instead.
