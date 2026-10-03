---
name: Codebase Content Structure
description: Actual Post file structure in the codebase, correcting the system prompt paths and documenting real conventions (verified 2026-09-27)
type: reference
---

A Post is one dated entry in the Blog (see apps/website/GLOSSARY.md). The site is a monorepo: every content path
below is under `apps/website/`.

## Post File Location

Posts are NOT in `src/content/posts/YYYY-MM-DD-slug.mdx` as the system prompt suggests.

**Actual structure**: `apps/website/src/content/blog/post/[year]/[month]/[day]/[slug]/content.mdx`

Example: `apps/website/src/content/blog/post/2025/03/01/llm/content.mdx`

**Why:** The codebase uses a nested directory structure where year, month, day, and slug are separate directory levels, and the actual content file is always named `content.mdx`.

**How to apply:** When creating new Posts, use the actual directory structure pattern, not the flat file pattern mentioned in the system prompt.

## Image Conventions

Images are **co-located** with their content. Each Post directory has a `media/` subfolder (it MUST be named `media`:
the copy script keys off that path segment; the old `images/` name is gone).

- **Physical location**: `apps/website/src/content/blog/post/<year>/<month>/<day>/<slug>/media/<image-name>.jpg`
- **Frontmatter path**: `image: /media/content/blog/post/<year>/<month>/<day>/<slug>/<image-name>.jpg`
- **Inline markdown**: `![alt](/media/content/blog/post/<year>/<month>/<day>/<slug>/<image-name>.png)`
- **Build-time copy**: `apps/website/src/lib/images/copy-content-media.ts` mirrors `apps/website/src/content/**/media/`
  to `apps/website/public/media/content/` (specular mapping, `media/` segment stripped). That output directory is
  gitignored.

When creating a new Post, place images in the Post's `media/` directory and reference them with the
`/media/content/blog/post/<year>/<month>/<day>/<slug>/` prefix.

## YouTube Component Import

```
import { Youtube } from "matrix-design-system";
```

Note: Component name is `Youtube` (capital Y, lowercase outube), not `YouTube`. The design system is now the
`matrix-design-system` package; the old `@/components/design-system/...` import path no longer exists.

## Frontmatter Format

```yaml
---
title: "Title"
description: "Description"
date: YYYY-MM-DD
image: /media/content/blog/post/<year>/<month>/<day>/<slug>/image-name.jpg
tags: [tag1, tag2]
authors: [fabrizio_duroni]
---
```

Date format is `YYYY-MM-DD` without quotes in some Posts and with quotes in others. Both work.

## Post Opening Convention

After frontmatter (and optional imports), Posts follow this pattern:
1. Italic abstract (usually echoing/expanding the description)
2. Horizontal rule (`---`)
3. Body content begins
