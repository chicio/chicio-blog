---
name: Chrome Built-in AI Integration
description: Post pages use the Chrome AI Summarizer API via the chrome-ai-features-toolbar store
type: project
---

Post pages integrate Chrome's built-in AI Summarizer API through
`apps/website/src/components/content/blog/blog-post-content/chrome-ai-features-toolbar/` (store
`use-chrome-ai-features-toolbar-store.ts`, modal `chrome-summary-modal/`). History: this replaced a
`use-chrome-summarize` hook under the old `src/components/sections/blog/hooks/` tree (verified 2026-09-27).

This is a cutting-edge browser API — only works in Chrome with the feature enabled. The store handles availability detection and graceful fallback.
