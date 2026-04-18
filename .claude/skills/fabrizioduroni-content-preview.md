---
name: fabrizioduroni-content-preview
description: "Verify new blog or DSA content before committing — runs build, validates frontmatter, checks search index"
---

# Content Preview Verification

Run a full verification of new or modified content to catch issues before committing.

## Steps

### 1. Identify Changed Content Files

Run `git diff --name-only HEAD` and `git status --short` to find new or modified `.mdx` files in `src/content/`.

### 2. Validate Frontmatter

For each changed `.mdx` file, read it and verify:
- **Required fields present**: `title`, `description`, `date`, `image`, `tags`, `authors`
- **Date format**: `YYYY-MM-DD`
- **Image exists**: Check that the referenced image path exists in `public/`
- **Tags is an array**: Not a string
- **Authors includes** `fabrizio_duroni`

For DSA exercise files, also check:
- `metadata.technique` is present and non-empty
- `metadata.leetcodeUrl` is a valid LeetCode URL

Report any missing or malformed fields.

### 3. Check Component Imports

For each changed `.mdx` file that uses JSX components (lines containing `<ComponentName`):
- Verify the component is imported at the top of the file (after frontmatter)
- Verify the import path uses the `@/` alias

### 4. Run Build Verification

```bash
npm run lint
npm run build
```

Both must pass with zero errors.

### 5. Report Results

Summarize:
- Number of content files checked
- Any frontmatter issues found
- Any missing imports
- Lint/build status
- If content changed: confirm search index would regenerate (it runs automatically in prebuild)
