---
name: Media Co-location & Public Static Media Architecture
description: All media (co-located MDX content + static public assets) unified under public/media/; build-time copy pipeline for content media
type: project
---

# Media Co-location & Public Static Media Architecture

## public/media/ tree structure

```
public/media/
├── content/        # build output — gitignored, regenerated on every build
├── sounds/         # static — knock-knock.mp3
├── authors/        # static — author profile photos (was images/authors/)
├── clowns/         # static — easter egg images (was images/clowns/)
├── chat-avatar.png # static branding (was images/chat-avatar.png)
├── chicio-art.png  # static branding (was images/chicio-art.png)
├── icon.png        # static branding (was images/icon.png)
└── logo.png        # static branding (was images/logo.png)
```

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
- Blog post media: `src/content/blog/post/<year>/<month>/<day>/<slug>/media/`
- Videogame console media: `src/content/videogames/console/<console>/media/` (gallery, logo)
- Videogame game media: `src/content/videogames/console/<console>/game/<game>/media/` (cover, media, gameplay)
- Videogame shared: `src/content/videogames/media/manufacturer/` (nintendo.png, sony.png)
- Art media: `src/content/art/media/`
- Technologies: `src/content/about-me/media/technologies/`
- Carrier (timeline): `src/content/about-me/media/carrier/`
- Projects: `src/content/about-me/media/projects/`
- Tattoos: `src/content/about-me/media/tattoos/`

## What lives at public/media/ top level (static, committed)
- `public/media/authors/` — author profile photos (15 authors)
- `public/media/clowns/` — easter egg images (clown-1.jpg through clown-9.jpg)
- `public/media/chat-avatar.png`
- `public/media/chicio-art.png`
- `public/media/icon.png`
- `public/media/logo.png`

## What lives in public/media/sounds/ (static, committed)
- `public/media/sounds/knock-knock.mp3` — Neo room easter egg door knock sound

## Supported extensions (content media copy)
Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`, `.svg`, `.ico`
Video: `.mp4`, `.webm`

## Key files
- `src/lib/images/copy-content-media.ts` — copies media from src/content to public/media/content (renamed from copy-content-images.ts in PR #354)
- `src/lib/build/prebuild.ts` — orchestrates search index, media copy, and serwist build
- `public/media/content/` — gitignored, regenerated on every build

## CRITICAL: computeOutputPath segment detection
The copy script uses `segments.indexOf("media")` to find the split point. If the `media/` directory segment name is ever wrong in src/content paths, the script silently skips all files.

## Redirects in next.config.ts — ORDER MATTERS
1. `/images/content/:path*` → `/media/content/:path*` (most specific, from PR #354)
2. `/images/:path*` → `/media/:path*` (general, from PR #355 follow-up flatten)
3. `/sounds/:path*` → `/media/sounds/:path*` (from PR #355)

All permanent (308). Rule 1 must appear before rule 2 — Next.js evaluates top-to-bottom; the more specific `/images/content/` match would otherwise be swallowed by `/images/`.

## Static TypeScript imports (filesystem paths, not URL strings)
These files use TypeScript static import syntax (not URL strings) — URL-string rewrites alone are insufficient:
- `src/components/design-system/organism/header/brand-header.tsx` — `import logoImage from "../../../../../public/media/logo.png"`
- `src/content/home/technology.ts` — imports from `../about-me/media/technologies/`
- `src/content/home/timeline.ts` — imports from `../about-me/media/carrier/`

## Runtime URL patterns
- Co-located content media: `/media/content/...` prefix
- Static public images/assets: `/media/...` directly (no `images/` segment — flattened)
- Static sounds: `/media/sounds/...` prefix
- Email templates use absolute prod URL: `https://www.fabrizioduroni.it/media/logo.png`

## Molecule: SelfHostedVideo
`src/components/design-system/molecules/video/self-hosted-video.tsx` — Added in PR #354.
Renders `<video>` with `src="/media/content/..."` paths for self-hosted `.mp4`/`.webm` files in MDX.

## Migration history
- Original image co-location (PR #318): `images/` dirs, `public/images/content/`, `copy-content-images.ts`
- PR #354 (2026-06-05): `src/content/**/images/` → `media/`, build output → `public/media/content/`, added video support, added SelfHostedVideo molecule, added `/images/content/` redirect
- PR #355 (2026-06-05): `public/images/` → `public/media/images/`, `public/sounds/` → `public/media/sounds/`, added `/images/` and `/sounds/` redirects
- PR #355 follow-up (2026-06-05): flattened `public/media/images/` → `public/media/` (no `images/` subdirectory); updated `/images/` redirect destination from `/media/images/` to `/media/`

## Note: CLAUDE.md stale reference
CLAUDE.md in the repo root still mentions "Co-located Images" with old `images/` and `public/images/content/` paths. This is outdated — the actual system uses `media/` everywhere. Do NOT auto-edit CLAUDE.md without explicit user instruction.
