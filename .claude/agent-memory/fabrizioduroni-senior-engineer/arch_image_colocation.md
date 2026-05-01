---
name: Image Co-location Architecture
description: Content images co-located with MDX files in src/content, served via build-time copy script
type: project
---

# Image Co-location Architecture (merged PR #318)

## Specular mapping rule
`src/content/<path>/images/<rest>` → `public/images/content/<path>/<rest>`

Examples:
- `src/content/blog/post/2024/01/15/slug/images/foo.jpg` → `public/images/content/blog/post/2024/01/15/slug/foo.jpg`
- `src/content/videogames/console/ps5/images/gallery/1.jpg` → `public/images/content/videogames/console/ps5/gallery/1.jpg`
- `src/content/videogames/images/manufacturer/sony.png` → `public/images/content/videogames/manufacturer/sony.png`
- `src/content/about-me/images/technologies/react.png` → `public/images/content/about-me/technologies/react.png`
- `src/content/art/images/2024-02-07.jpg` → `public/images/content/art/2024-02-07.jpg`

## What lives where
- Blog post images: `src/content/blog/post/<year>/<month>/<day>/<slug>/images/`
- Videogame console images: `src/content/videogames/console/<console>/images/` (gallery, logo)
- Videogame game images: `src/content/videogames/console/<console>/game/<game>/images/` (cover, media, gameplay)
- Videogame shared: `src/content/videogames/images/manufacturer/` (nintendo.png, sony.png)
- Art images: `src/content/art/images/`
- Technologies: `src/content/about-me/images/technologies/`
- Carrier (timeline): `src/content/about-me/images/carrier/`
- Projects: `src/content/about-me/images/projects/`
- Tattoos: `src/content/about-me/images/tattoos/`
- About-me-only images (game-boy.jpg, apple-microsoft-linux.jpg): `src/content/about-me/images/` (root)

## What stays in public/images/ (committed)
- `public/images/authors/` — author profile photos
- `public/images/clowns/` — easter egg images
- Root branding assets: `chat-avatar.png`, `chicio-art.png`, `icon.png`, `logo.png`

## Key files
- `src/lib/images/copy-content-images.ts` — copies images from src/content to public/images/content
- `src/lib/build/prebuild.ts` — orchestrates search index, image copy, and serwist build
- `public/images/content/` — gitignored, regenerated on every build

## Static imports (TS files)
- `src/content/home/technology.ts` — imports from `../about-me/images/technologies/`
- `src/content/home/timeline.ts` — imports from `../about-me/images/carrier/`
- `src/content/home/projects.ts` — string paths `/images/content/about-me/projects/`

## Runtime URL pattern
All content image URLs use `/images/content/...` prefix.

## Gotchas encountered during migration
- The reverse map for non-blog MDX paths must use `path.relative(contentRoot, filePath)` — not raw segment slicing — otherwise double `content` appears in path
- Some blog posts share the same image (e.g. uncle-bob, spm-swift, mockup-model-view-presenter) — copy the image to each post's images/ directory
- game-boy.jpg and apple-microsoft-linux.jpg are referenced only by about-me/content.mdx and videogames/content.mdx (not any blog post) — they live in src/content/about-me/images/ at root level
- MDX regex for body image refs must be careful not to capture title text after closing `)` — use `[^\s)"']+` pattern
