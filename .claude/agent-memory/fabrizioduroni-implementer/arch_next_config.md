---
name: Next.js Configuration
description: MDX plugins, React Compiler, image optimization, and URL redirects in next.config.ts
type: project
---

## MDX Pipeline (apps/website/next.config.ts)
- Remark: gfm, emoji, math, frontmatter
- Rehype: slug, autolink-headings, highlight, katex, figure
- Integration via @next/mdx

## Key Config
- React Compiler enabled (`reactCompiler: true`, top-level, no longer experimental)
- Image optimization: AVIF/WebP, 86400s cache TTL
- URL redirects: legacy date-based Post URLs (`/YYYY/MM/DD/slug`, `.html` too) → `/blog/post/YYYY/MM/DD/slug`;
  legacy `/images/*` and `/sounds/*` → `/media/*`

## Build & Release
- `release-it` with conventional changelog
- Builds before release via `before:init` hook
- npm publishing disabled (static site on Vercel)
- CI: GitHub Actions on `ubuntu-latest`, Node 24.x from root `package.json` `engines` (see [[project_ci_pipeline]])
- Secrets needed: UPSTASH_VECTOR_*, UPSTASH_REDIS_*, RESEND_API_KEY
