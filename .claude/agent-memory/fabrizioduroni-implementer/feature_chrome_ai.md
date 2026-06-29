---
name: Chrome Built-in AI Integration
description: Blog section uses Chrome AI Summarizer API via use-chrome-summarize hook
type: project
---

The blog section has a `use-chrome-summarize` hook (`src/components/sections/blog/hooks/use-chrome-summarize.ts`) that integrates with Chrome's built-in AI Summarizer API.

This is a cutting-edge browser API — only works in Chrome with the feature enabled. The hook handles availability detection and graceful fallback.
