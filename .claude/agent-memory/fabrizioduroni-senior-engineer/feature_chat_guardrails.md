---
name: Chat Guardrails
description: Three-layer input guardrail pipeline for the chatbot API — injection, safety, topic relevance
type: project
---

Guardrails implemented in `src/lib/chat/guardrails.ts`. Pipeline runs before every `streamText` call in `src/app/api/chat/route.ts`.

**Three layers (in order):**
1. `checkPromptInjection(message)` — sync regex, ~0ms, no API call. Catches jailbreak phrases like "ignore previous instructions", "you are now", "pretend to be", etc.
2. `checkInputSafety(message)` — Groq `meta-llama/llama-guard-3-8b`. Returns "safe" or "unsafe\nS[N]". Zero extra infra cost (same Groq account).
3. `checkTopicRelevance(message)` — Groq `llama-3.1-8b-instant` as a strict yes/no classifier. Keeps chat scoped to Fabrizio + software dev topics. `maxOutputTokens: 5, temperature: 0`.

**Orchestration:** `runGuardrails(message)` runs injection check first (sync), then safety + relevance in `Promise.all`. All async guards fail open — if Groq is unavailable, request is allowed through (matches rate-limiter pattern).

**Error surface:** Blocked requests return `new Response(blockedReason, { status: 400 })` plain text (not JSON). `chat.tsx` displays `error.message` so the user sees the specific blocked reason.

**Why plain text 400 (not JSON):** `@ai-sdk/react` `useChat` reads the response body as text when non-2xx, and that text becomes `error.message`. JSON bodies would render as a raw JSON string in the UI.

**PR:** https://github.com/chicio/chicio-blog/pull/283
