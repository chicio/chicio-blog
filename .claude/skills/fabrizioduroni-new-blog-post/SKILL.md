---
name: fabrizioduroni-new-blog-post
description: "Scaffold a new blog post with correct directory structure, frontmatter, and opening template"
user_invocable: true
---

# New Blog Post Scaffold

Create a new blog post with the correct directory structure and frontmatter template.

## Steps

### 1. Gather Information

Ask the user for:
1. **Title**: The blog post title
2. **Slug**: URL-friendly name (e.g., `my-new-post`). Suggest one based on the title if not provided.
3. **Description**: One-line description for SEO and the italic abstract
4. **Tags**: List of tags (suggest based on existing tags in other posts)
5. **Image**: Featured image. Images are co-located with the post in a `media/` folder (see step 3). Suggest reusing an existing post's featured image, or use a placeholder path and let the user drop the real file into the post's `media/` folder later.

### 2. Create a new branch

Create a new branch with the title of the article separated by dashes.

### 3. Create Directory

Today's date determines the path. Create the post directory and its co-located `media/` folder (image files live here and are mirrored to `public/media/content/...` at build time — the folder MUST be named `media`):

```
src/content/blog/post/YYYY/MM/DD/<slug>/
src/content/blog/post/YYYY/MM/DD/<slug>/media/
```

### 4. Create content.mdx

Write `content.mdx` with:

```mdx
---
title: "<title>"
description: "<description>"
date: YYYY-MM-DD
image: /media/content/blog/post/YYYY/MM/DD/<slug>/<image-file>
tags: [<tags>]
authors: [fabrizio_duroni]
---

*<description expanded into an italic abstract>*

---

<!-- Start writing here -->
```

### 5. Confirm

Tell the user:
- The file path created
- Remind them to run `npm run dev` to see it locally
- The search index will regenerate automatically
