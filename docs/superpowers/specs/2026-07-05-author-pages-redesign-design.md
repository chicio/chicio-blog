# Author pages redesign — design

**Date:** 2026-07-05
**Scope:** `/blog/authors` (index cards), `/blog/author/[authorId]` (detail), and the About Me top box.
**Builds on:** PR #421 (authors index + per-author pages + Blog nav dropdown).

## Goal

Two UI improvements, plus a consistency refactor:

1. Make the **author cards** on the authors index catchier, in the site's own visual language.
2. Give the **author detail page** an organized profile hero, mirroring the box at the top of About Me.
3. Extract a **shared profile-hero shell** so About Me and the author detail page look consistent.

## Constraints & context

- Design-system layering is enforced at error by dependency-cruiser: `design-system/**` may not import
  from `lib/`, `features/`, `content/`, `app/`, and may import from `types/` type-only. Content pages may not
  import each other. A shell shared by `content/about-me` and `content/blog` must therefore live in
  `design-system` (pure, props-driven) — not in either content folder.
- Author data reality: most authors have only `name`, `linkedinUrl`, and `image`. `role`, `bio`, `siteUrl`,
  `xUrl`, `githubUrl` are optional and empty for nearly everyone. The detail box must **render only the
  fields that exist** and degrade gracefully.
- The owner (`fabrizio_duroni`) already redirects to `/about-me` via `authorHref` — the detail box serves the
  other authors; About Me is Fabrizio's equivalent.
- `ProfilePhoto` (design-system organism) currently **hardcodes** Fabrizio's image src and takes `author` only
  for alt text — it is not reusable for other authors as-is.
- The author card is a single wrapping `InternalLink`; nesting another anchor (e.g. the `Tag` molecule) inside
  it would produce invalid nested `<a>` elements.

## Design

### 1. Author card — Direction A (glass + hover lift)

File: `src/components/content/blog/blog-authors/author-card/author-card.tsx`

- Wrap the card in the site glassmorphism styling (frosted card, `border-accent-alpha-40` brightening to
  `border-accent` on hover, `shadow-lg` glow, spring `hover:scale-102`), consistent with the rest of the blog.
  Reuse the existing `glassmorphism` / `glow-container` styling rather than inventing new CSS.
- Content unchanged: circular glow photo (`ImageGlow`) · name · post count.
- **Name uses the site sans font (Open Sans)** — the default — not the mono face.
- **Post count reuses the tag chip** (see §4): render it via the new shared `Chip` atom (non-link variant), so
  it matches the tag pills on the post cards.
- Keep the existing `useInView` gate in the store (cards render on scroll into view).

### 2. Shared profile-hero shell (new)

New component: `src/components/design-system/organism/profile-hero/`
(`profile-hero.tsx`, `index.ts`; no store — presentational, mirrors `ProfilePhoto` which has no store).

- Props: `{ name: string; role?: string; imageSrc?: string; imageAlt?: string; children?: ReactNode }`.
- Renders the glassmorphism card + `ProfilePhoto` + name (h-level heading) + optional role + a `children` slot
  for whatever sits below (section pills for About Me; bio/socials/count for the author page).
- Calls only `useGlassmorphism` (the permanent one-hook exception) — no other hooks, no store.
- Heading levels match the current About Me box (name = `h3`, role = `h5`) so About Me has no heading-order
  regression; the author page adopts the same levels.
- Pure and props-driven: no `siteMetadata`, `slugs`, or tracking inside (injected by the caller), so it satisfies
  the design-system isolation rules.

### 3. Generalize `ProfilePhoto`

File: `src/components/design-system/organism/profile-photo/profile-photo.tsx`

- Add optional `src?: string` prop, defaulting to the current `/media/authors/fabrizio-duroni.jpg`.
- Keep `author` as the alt text. Backwards compatible — existing About Me / homepage usage is unaffected.
- `ProfileHero` passes the per-author image through to `ProfilePhoto`.

### 4. Extract a shared `Chip` atom from `Tag`

New atom: `src/components/design-system/atoms/chip/` (`chip.tsx`, `index.ts`).

- `Chip` renders the pill span that `Tag` currently renders inline:
  `glow-container text-shadow-sm p-<n> block text-primary-text <text-size> leading-none`.
  Props: `{ children: ReactNode; big?: boolean; className?: string }`.
- Refactor `Tag` (`design-system/molecules/buttons/tag`) to compose `InternalLink` + `Chip` — no behavior change
  for existing tag usage (post cards, tag lists).
- The author card uses `Chip` directly (no link) for the post count, avoiding nested anchors.

### 5. About Me top box — use the shared shell

Files: `src/components/content/about-me/about-me/about-me-table-of-contents/*`

- Refactor `AboutMeTableOfContents` to render `ProfileHero` (name = `siteMetadata.author`,
  role = "Software Engineer", imageSrc = Fabrizio's author image) with its existing **4 section-jump pills**
  (Biography / Technologies / Experience / Open Source) passed as `children`.
- The scroll-to-section store logic stays exactly as-is.
- No socials added here — the box keeps its navigation purpose; only the visual shell is unified.

### 6. Author detail page — profile hero

Files: `src/components/content/blog/blog-author/*`

- Replace the current bare centered stack (photo · name · lone LinkedIn button) with `ProfileHero`
  (name = `author.name`, role = `author.role` if present, imageSrc = `author.imageLarge ?? author.image`),
  with a `children` slot containing, in order:
  1. **Bio** — `author.bio`, rendered only when present.
  2. **Socials row** — a lightweight private sub-component `blog-author/author-socials/` using `ExternalLink`
     + `react-icons`: LinkedIn always; GitHub / X / Website (`siteUrl`) each rendered only when that field
     exists. (The existing `SocialContacts` organism is site-global and requires 8 tracking callbacks — wrong
     fit for per-author links.)
  3. **Post-count chip** — reuse the `Chip` atom: e.g. `N posts published`.
- The `Posts published (N)` section and posts grid below are unchanged.

### Tracking

The current author-page LinkedIn link is **not** tracked. To match existing behavior we add **no new tracking**
for the author socials. (If we later want click tracking, it plumbs through the content layer, not the shell.)

## Components touched — summary

| Component | Change |
|---|---|
| `design-system/atoms/chip` | **New** — pill span extracted from `Tag` |
| `design-system/molecules/buttons/tag` | Refactor to compose `InternalLink` + `Chip` (no behavior change) |
| `design-system/organism/profile-photo` | Add optional `src` prop (default = Fabrizio's image) |
| `design-system/organism/profile-hero` | **New** — glass shell: photo + name + role + `children` slot |
| `content/about-me/.../about-me-table-of-contents` | Use `ProfileHero`; pills become its `children` |
| `content/blog/blog-authors/author-card` | Glass styling + `Chip` post count + sans name |
| `content/blog/blog-author/blog-author` | Use `ProfileHero`; bio + socials + count in the slot |
| `content/blog/blog-author/author-socials` | **New** private sub-component — per-author social links |

## Testing

- **`Chip`** — renders children; `big` size variant.
- **`Tag`** — existing tests stay green after the refactor (link + text still render).
- **`ProfilePhoto`** — renders default src with no prop; renders provided src when passed.
- **`ProfileHero`** — renders name always; renders role only when provided; renders `children`.
- **`AboutMeTableOfContents`** — still renders name, "Software Engineer", and all 4 section jump buttons.
- **`AuthorCard`** — renders name + post-count chip; correct singular/plural ("1 post" / "N posts").
- **`AuthorSocials`** — renders LinkedIn always; renders GitHub/X/Website only when the field is present;
  hides them when absent (graceful degradation).
- Keep coverage at or above the current floor (statements 64 / branches 59 / functions 61 / lines 65 over
  `lib/**` + `design-system/**`).

## Verification

`npm run lint`, `npm run validate-architecture`, `npm run knip`, `npm run typecheck`, `npm run test:run`,
`npm run build`; manual browser check of `/blog/authors`, a sparse author detail page, and `/about-me`
(agent-browser live QA).

## Out of scope (YAGNI)

- Enriching author records with role/bio/extra socials (the UI supports them; filling data is a separate task).
- Any change to the Blog nav dropdown, the posts grid, or `authorHref` routing.
- Click tracking for author social links.
