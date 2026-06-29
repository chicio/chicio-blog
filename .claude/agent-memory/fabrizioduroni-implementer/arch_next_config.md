---
name: Next.js Configuration
description: MDX plugins, React Compiler, image optimization, and URL redirects in next.config.ts
type: project
---

## MDX Pipeline (next.config.ts)
- Remark: gfm, emoji, math, frontmatter
- Rehype: slug, autolink-headings, highlight, katex, figure
- Integration via @next/mdx

## Key Config
- React Compiler enabled (experimental)
- Image optimization: AVIF/WebP, 86400s cache TTL
- URL redirects: legacy date-based blog URLs (`/YYYY/MM/DD/slug`) → `/blog/post/YYYY/MM/DD/slug`

## Build & Release
- `release-it` with conventional changelog
- Builds before release via `before:init` hook
- npm publishing disabled (static site on Vercel)
- CI: GitHub Actions on macOS, Node 22
- Secrets needed: UPSTASH_VECTOR_*, UPSTASH_REDIS_*, RESEND_API_KEY
