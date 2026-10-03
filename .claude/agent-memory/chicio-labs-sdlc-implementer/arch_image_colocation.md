---
name: Media Co-location & Public Static Media Architecture
description: All media (co-located MDX content + static public assets) unified under public/media/; build-time copy pipeline for content media
type: project
---

# Media Co-location & Public Static Media Architecture

## public/media/ tree structure

```
apps/website/public/media/
├── content/        # build output — gitignored, regenerated on every build
├── video/          # static — Easter Egg videos (.mp4 + poster .jpg + .vtt captions)
├── authors/        # static — Author profile photos (was images/authors/)
├── clowns/         # static — Clowns images (was images/clowns/)
├── chat-avatar.png # static branding (was images/chat-avatar.png)
├── chicio-art.png  # static branding (was images/chicio-art.png)
├── icon.png        # static branding (was images/icon.png)
└── logo.png        # static branding (was images/logo.png)
```

All `public/` paths below are under `apps/website/`; all `src/` paths are `apps/website/src/` (verified 2026-09-27).
`public/sounds/` no longer exists (the knock-knock mp3 went with the old Neo room egg); the `/sounds/*` redirect remains.

`public/images/` and `public/sounds/` were consolidated into `public/media/` in PR #355 (2026-06-05).
`public/media/content/` was introduced in PR #354 (2026-06-05) for co-located MDX content media.
`public/media/images/` was flattened directly into `public/media/` (follow-up to PR #355, 2026-06-05).

## Co-located content media: specular mapping rule

`src/content/<path>/media/<rest>` → `public/media/content/<path>/<rest>`

Examples:
- `src/content/blog/post/2024/01/15/slug/media/foo.jpg` → `public/media/content/blog/post/2024/01/15/slug/foo.jpg`
- `src/content/videogames/console/ps5/media/gallery/1.jpg` → `public/media/content/videogames/console/ps5/gallery/1.jpg`
- `src/content/videogames/media/manufacturer/sony.png` → `public/media/content/videogames/manufacturer/sony.png`
- `src/content/about-me/media/technologies/react.png` → `public/media/content/about-me/technologies/react.png`
- `src/content/art/media/2024-02-07.jpg` → `public/media/content/art/2024-02-07.jpg`

## What lives where (co-located content media)
- Post media: `src/content/blog/post/<year>/<month>/<day>/<slug>/media/`
- Videogame console media: `src/content/videogames/console/<console>/media/` (gallery, logo)
- Videogame game media: `src/content/videogames/console/<console>/game/<game>/media/` (cover, media, gameplay)
- Videogame shared: `src/content/videogames/media/manufacturer/` (nintendo.png, sony.png)
- Art media: `src/content/art/media/`
- Technologies: `src/content/about-me/media/technologies/`
- Carrier (timeline): `src/content/about-me/media/carrier/`
- Projects: `src/content/about-me/media/projects/`
- Tattoos: `src/content/about-me/media/tattoos/`

## What lives at public/media/ top level (static, committed)
- `public/media/authors/` — Author profile photos
- `public/media/clowns/` — Clowns images (clown-1.jpg through clown-9.jpg)
- `public/media/chat-avatar.png`
- `public/media/chicio-art.png`
- `public/media/icon.png`
- `public/media/logo.png`

## What lives in public/media/video/ (static, committed)
- One `.mp4` + `-poster.jpg` + `.vtt` per Easter Egg (dodge-this, i-know-kung-fu, the-choice, the-one,
  the-white-rabbit, there-is-no-spoon)

## Supported extensions (content media copy)
Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`, `.svg`, `.ico`
Video: `.mp4`, `.webm`

## Key files
- `src/lib/images/copy-content-media.ts` — copies media from src/content to public/media/content (renamed from copy-content-images.ts in PR #354)
- `src/lib/build/prebuild.ts` — orchestrates search index, media copy, and serwist build
- `public/media/content/` — gitignored, regenerated on every build

## CRITICAL: computeOutputPath segment detection
The copy script uses `segments.indexOf("media")` to find the split point. If the `media/` directory segment name is ever wrong in src/content paths, the script silently skips all files.

## Redirects in apps/website/next.config.ts — ORDER MATTERS
1. `/images/content/:path*` → `/media/content/:path*` (most specific, from PR #354)
2. `/images/:path*` → `/media/:path*` (general, from PR #355 follow-up flatten)
3. `/sounds/:path*` → `/media/sounds/:path*` (from PR #355)

All permanent (308). Rule 1 must appear before rule 2 — Next.js evaluates top-to-bottom; the more specific `/images/content/` match would otherwise be swallowed by `/images/`.

## Static TypeScript imports (filesystem paths, not URL strings)
These files use TypeScript static import syntax (not URL strings) — URL-string rewrites alone are insufficient:
- `apps/website/src/components/features/design-system-next/brand-header/brand-header.tsx` (the BrandHeader Binding) —
  `import logoImage from "../../../../../public/media/logo.png"`; the design-system `BrandHeader` takes the logo as a prop
- `src/content/home/technology.ts` — imports from `../about-me/media/technologies/`
- `src/content/home/timeline.ts` — imports from `../about-me/media/carrier/`

## Runtime URL patterns
- Co-located content media: `/media/content/...` prefix
- Static public images/assets: `/media/...` directly (no `images/` segment — flattened)
- Static video: `/media/video/...` prefix
- Email templates use absolute prod URL: `https://www.fabrizioduroni.it/media/logo.png`

## Molecule: SelfHostedVideo
`packages/matrix-design-system/src/molecules/video/self-hosted-video/` — Added in PR #354.
Renders `<video>` with `src="/media/content/..."` paths for self-hosted `.mp4`/`.webm` files in MDX.

## Migration history
- Original image co-location (PR #318): `images/` dirs, `public/images/content/`, `copy-content-images.ts`
- PR #354 (2026-06-05): `src/content/**/images/` → `media/`, build output → `public/media/content/`, added video support, added SelfHostedVideo molecule, added `/images/content/` redirect
- PR #355 (2026-06-05): `public/images/` → `public/media/images/`, `public/sounds/` → `public/media/sounds/`, added `/images/` and `/sounds/` redirects
- PR #355 follow-up (2026-06-05): flattened `public/media/images/` → `public/media/` (no `images/` subdirectory); updated `/images/` redirect destination from `/media/images/` to `/media/`

## Note: project instructions
`AGENTS.md` ("Co-located Images") now documents the `media/` layout correctly; the old `images/` wording is gone.
