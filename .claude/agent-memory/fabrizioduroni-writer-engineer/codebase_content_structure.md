---
name: Codebase Content Structure
description: Actual blog post file structure in the codebase, correcting the system prompt paths and documenting real conventions
type: reference
---

## Blog Post File Location

Posts are NOT in `src/content/posts/YYYY-MM-DD-slug.mdx` as the system prompt suggests.

**Actual structure**: `src/content/blog/post/[year]/[month]/[day]/[slug]/content.mdx`

Example: `src/content/blog/post/2025/03/01/llm/content.mdx`

**Why:** The codebase uses a nested directory structure where year, month, day, and slug are separate directory levels, and the actual content file is always named `content.mdx`.

**How to apply:** When creating new blog posts, use the actual directory structure pattern, not the flat file pattern mentioned in the system prompt.

## Image Conventions

Images are **co-located** with their content. Each blog post directory has an `images/` subfolder containing all images for that post.

- **Physical location**: `src/content/blog/post/<year>/<month>/<day>/<slug>/images/<image-name>.jpg`
- **Frontmatter path**: `image: /images/content/blog/post/<year>/<month>/<day>/<slug>/<image-name>.jpg`
- **Inline markdown**: `![alt](/images/content/blog/post/<year>/<month>/<day>/<slug>/<image-name>.png)`
- **Build-time copy**: A script copies `src/content/**/images/` to `public/images/content/` (specular mapping, `images/` segment stripped). The `public/images/content/` directory is gitignored.

When creating a new blog post, place images in the post's `images/` directory and reference them with the `/images/content/blog/post/<year>/<month>/<day>/<slug>/` prefix.

## YouTube Component Import

```
import { Youtube } from "@/components/design-system/molecules/video/youtube";
```

Note: Component name is `Youtube` (capital Y, lowercase outube), not `YouTube`.

## Frontmatter Format

```yaml
---
title: "Title"
description: "Description"
date: YYYY-MM-DD
image: /images/posts/image-name.jpg
tags: [tag1, tag2]
authors: [fabrizio_duroni]
---
```

Date format is `YYYY-MM-DD` without quotes in some posts and with quotes in others. Both work.

## Post Opening Convention

After frontmatter (and optional imports), posts follow this pattern:
1. Italic abstract (usually echoing/expanding the description)
2. Horizontal rule (`---`)
3. Body content begins
