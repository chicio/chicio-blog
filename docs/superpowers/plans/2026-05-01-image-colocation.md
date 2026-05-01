# Image Co-location Plan

## Goal

Co-locate content images alongside their MDX/TS content files in `src/content/`, served via a build-time copy script that mirrors them into `public/images/content/`.

## Context & Motivation

Currently, content images live in `public/images/` (e.g. `public/images/posts/`, `public/images/videogames/`) while their corresponding content lives in `src/content/`. This creates three problems:
- **Discoverability**: opening a blog post directory doesn't show which images belong to it
- **Maintenance**: deleting/renaming a post leaves orphaned images in `public/`
- **Authoring friction**: writing a new post means juggling two directory trees

## Architecture

Images move from `public/images/{posts,videogames,art,technologies,carrier,projects,tattoos}` into `src/content/**/images/` directories. A TypeScript build-time script copies them to `public/images/content/` with a specular structure (mirroring the `src/content/` tree, stripping the `images/` segment). Path references across ~360 MDX files, ~5 TS data files, ~3 TSX components, and 1 Python script are updated to use the new `/images/content/...` URLs. Static imports in `technology.ts` and `timeline.ts` point directly to the source files in `src/content/`.

### Specular mapping rule

`src/content/<path>/images/<rest>` -> `public/images/content/<path>/<rest>`

Examples:
- `src/content/blog/post/2024/01/15/slug/images/foo.jpg` -> `public/images/content/blog/post/2024/01/15/slug/foo.jpg`
- `src/content/videogames/console/ps5/images/gallery/1.jpg` -> `public/images/content/videogames/console/ps5/gallery/1.jpg`
- `src/content/about-me/images/technologies/react.png` -> `public/images/content/about-me/technologies/react.png`
- `src/content/art/images/2024-02-07.jpg` -> `public/images/content/art/2024-02-07.jpg`

### What moves where

| Source (public/) | Destination (src/content/) | Images |
|---|---|---|
| `public/images/posts/` | `src/content/blog/post/<year>/<month>/<day>/<slug>/images/` | ~293 files, assigned by parsing each MDX for its image references |
| `public/images/videogames/` | `src/content/videogames/images/` | ~1205 files, preserving existing nested structure |
| `public/images/art/` | `src/content/art/images/` | ~98 files |
| `public/images/technologies/` | `src/content/about-me/images/technologies/` | 16 files |
| `public/images/carrier/` | `src/content/about-me/images/carrier/` | 7 files |
| `public/images/projects/` | `src/content/about-me/images/projects/` | 7 files |
| `public/images/tattoos/` | `src/content/about-me/images/tattoos/` | 1 file |

### What stays in `public/images/` (committed, unchanged)

- `public/images/authors/` — Author profile photos (component-level, no single content owner)
- `public/images/clowns/` — Easter egg images (component-level)
- `public/images/chat-avatar.png`, `chicio-art.png`, `icon.png`, `logo.png` — Root branding assets

### No backward compatibility for old image URLs

Old URLs like `/images/posts/foo.jpg` will break for external references (cached RSS, Google Image Search, social cards). This is acceptable — it's a personal blog and the impact is minimal and temporary.

---

## Implementation Steps

### Step 1: Create the build-time image copy script

Create `src/lib/images/copy-content-images.ts`. This TypeScript script:
- Walks `src/content/**/images/**`
- Copies each image file to `public/images/content/`, applying the specular mapping (strip the `images/` segment)
- Cleans `public/images/content/` before copying (fresh copy each time)
- Logs the count of copied images

Use Node.js `fs` and `path` APIs. For globbing, use `fs/promises` `glob` (available natively in Node 22). Filter by image extensions (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`, `.svg`, `.ico`).

Run it with `tsx src/lib/images/copy-content-images.ts`.

### Step 2: Create the unified prebuild orchestrator

Create `src/lib/build/prebuild.ts` that runs both the search index generation and the image copy in sequence. This replaces the individual npm hook commands.

Update `package.json`:
- `predev`: `tsx src/lib/build/prebuild.ts && NODE_ENV=development serwist build serwist.config.mjs`
- `prebuild`: `tsx src/lib/build/prebuild.ts`
- Add `copy-images` script for manual invocation: `tsx src/lib/images/copy-content-images.ts`

Note: `serwist build` stays outside `prebuild.ts` because `predev` needs `NODE_ENV=development` while `prebuild` doesn't run serwist (it runs after `next build`).

### Step 3: Update `.gitignore`

Add `public/images/content/` to `.gitignore` (after the existing serwist entries). This directory is generated output, like the search index.

### Step 4: Move blog post images to co-located directories

This is the largest migration (~293 images). Write a one-time migration script `scripts/migrate-blog-images.ts` that:
1. Walks all blog post `content.mdx` files in `src/content/blog/post/`
2. Extracts all `/images/posts/<filename>` references (frontmatter `image:` field + markdown `![](...)` in body)
3. For each referenced image, moves (renames) it from `public/images/posts/<filename>` to `<post-dir>/images/<filename>`
4. Reports orphan images (in `public/images/posts/` but not referenced by any post) and missing images (referenced but not found)
5. Image filenames are kept as-is (no renaming)

After running, investigate orphans. They may be referenced by DSA or about-me content. Manually assign them to the blog post that makes most sense, or delete if truly unused.

Remove `public/images/posts/` from git after migration.

### Step 5: Update blog post MDX image references

Write `scripts/update-blog-image-paths.ts` that:
1. Walks all blog post `content.mdx` files
2. Computes each post's new image path prefix: `/images/content/<relative-path-from-src/content-to-post-dir>/`
3. Replaces all `/images/posts/<filename>` references with the new specular path

Example: a post at `src/content/blog/post/2018/03/02/code-review/content.mdx` changes from `image: /images/posts/01-technology-version-update.jpg` to `image: /images/content/blog/post/2018/03/02/code-review/01-technology-version-update.jpg`.

### Step 6: Update non-blog MDX `/images/posts/` references

**This step MUST run after Step 4** (it depends on the blog images having already been moved).

DSA files (~266), about-me (`content.mdx`), and a few videogame MDX files (~4) reference `/images/posts/` images. Write `scripts/update-non-blog-image-paths.ts` that:
1. Builds a reverse lookup map from all migrated blog images: scans `src/content/blog/**/images/` and maps `{filename -> new-specular-path}`
2. **Collision detection**: if two images have the same filename but different paths, abort with an error
3. Walks MDX files in `src/content/data-structures-and-algorithms/`, `src/content/about-me/`, and `src/content/videogames/`
4. Replaces `/images/posts/<filename>` references using the reverse map
5. Also replaces `/images/tattoos/<filename>` references with `/images/content/about-me/tattoos/<filename>` (about-me/content.mdx line 47 has a tattoo image in the body)

### Step 7: Move videogame images

Copy the entire `public/images/videogames/` tree into `src/content/videogames/images/`, preserving the nested structure (`console/<name>/gallery/`, `console/<name>/game/<game>/media/`, etc.).

Write `scripts/update-videogame-image-paths.ts` — a simple global replacement of `/images/videogames/` with `/images/content/videogames/` across all MDX files in `src/content/videogames/`.

Remove `public/images/videogames/` from git.

### Step 8: Move art images

Copy `public/images/art/` to `src/content/art/images/`.

Update `src/components/sections/art/components/art-gallery.tsx` line 22:
- From: `` const imageUrl = `/images/art/${art.name}`; ``
- To: `` const imageUrl = `/images/content/art/${art.name}`; ``

Remove `public/images/art/` from git.

### Step 9: Move about-me related images

Move four directories into `src/content/about-me/images/`:
- `public/images/technologies/` -> `src/content/about-me/images/technologies/`
- `public/images/carrier/` -> `src/content/about-me/images/carrier/`
- `public/images/projects/` -> `src/content/about-me/images/projects/`
- `public/images/tattoos/` -> `src/content/about-me/images/tattoos/`

Update these files:

**`src/content/home/technology.ts`** (lines 2-17) — Change all 16 static imports. The file is at `src/content/home/technology.ts`, so the relative path to `src/content/about-me/images/technologies/` is `../about-me/images/technologies/`:
```typescript
import reactImage from "../about-me/images/technologies/react.png";
// ... same pattern for all 16 imports
```

**`src/content/home/timeline.ts`** (lines 2-8) — Change all 7 static imports similarly:
```typescript
import lastminuteImage from "../about-me/images/carrier/lastminute-group.png";
// ... same pattern for all 7 imports
```

**`src/content/home/projects.ts`** (lines 54, 78, 111, 144, 174, 204) — Update all 6 string paths:
- `'/images/projects/...'` -> `'/images/content/about-me/projects/...'`

**`src/components/sections/easter-eggs/components/dejavu.tsx`** (line 52):
- `src="/images/tattoos/matrix-pills.png"` -> `src="/images/content/about-me/tattoos/matrix-pills.png"`

Remove the four directories from git.

### Step 10: Update Python screenshot script

Update `scripts/add-game-screenshots.py` line 517:
- From: `f"/images/videogames/console/{console_slug}/game/{game_slug}/gameplay/{next_index}.jpg"`
- To: `f"/images/content/videogames/console/{console_slug}/game/{game_slug}/gameplay/{next_index}.jpg"`

### Step 11: Verify everything works

1. Run the copy script: `npx tsx src/lib/images/copy-content-images.ts`
2. Spot-check the output structure in `public/images/content/` for each category
3. `npm run lint` — zero errors
4. `npm run build` — success
5. `npm run dev` + manual browser check:
   - A blog post page — featured image and inline images load
   - A DSA topic page — featured image loads
   - A videogames console page — gallery images load
   - A game page — cover, media, gameplay images load
   - The art gallery page — all art images load
   - The about-me page — timeline, technologies, projects images load
   - The tattoo easter egg (click logo 4 times) — matrix pills image loads
   - RSS feed at `/rss.xml` — image URLs use new paths

### Step 12: Update documentation

Update `CLAUDE.md`:
- Add image co-location to the Architecture section
- Add a Key Patterns bullet explaining the build-time copy pipeline

Update `.claude/rules/mdx-content.md`:
- Change image reference examples to use the new `/images/content/...` paths
- Add note that images are co-located in the post's `images/` directory

### Step 13: Clean up migration scripts

Remove all one-time scripts:
```
scripts/migrate-blog-images.ts
scripts/update-blog-image-paths.ts
scripts/update-non-blog-image-paths.ts
scripts/update-videogame-image-paths.ts
```
