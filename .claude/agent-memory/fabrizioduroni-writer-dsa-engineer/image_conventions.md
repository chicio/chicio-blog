---
name: image-conventions
description: How DSA content references images — co-located with blog posts, served via /images/content/ prefix
type: reference
---

## DSA Image References

DSA topics and exercises use a shared featured image from a blog post. The image is co-located with the blog post that introduced the DSA section.

**Frontmatter format:**
```yaml
image: /images/content/blog/post/<year>/<month>/<day>/<slug>/<image-name>.jpg
```

**Physical location of the image:** `src/content/blog/post/<year>/<month>/<day>/<slug>/images/<image-name>.jpg`

**Current DSA featured image:** Most DSA content uses `data-structures-and-algorithms-featured.png` from the blog post that launched the DSA section. The full path in frontmatter is: `image: /images/content/blog/post/<year>/<month>/<day>/<slug>/data-structures-and-algorithms-featured.png` (look at existing DSA content.mdx files for the exact path after migration).

**Why this path format:** Images are co-located with content in `src/content/**/images/` directories. A build-time script copies them to `public/images/content/` using a specular mapping (mirroring the content tree, stripping the `images/` segment). The `public/images/content/` directory is gitignored.

**How to apply:** When creating new DSA topics or exercises, copy the `image:` frontmatter from an existing topic/exercise. If a new image is needed, place it in the relevant blog post's `images/` directory and reference it with the `/images/content/blog/post/...` prefix.
