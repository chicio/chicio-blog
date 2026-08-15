---
name: Chat Guardrails
description: Three-layer input guardrail pipeline for the chatbot API — injection, safety, topic relevance
type: project
---

Guardrails implemented in `src/lib/chat/guardrails.ts`. Pipeline runs before every `streamText` call in `src/app/api/chat/route.ts`.

**Three layers (in order):**
1. `checkPromptInjection(message)` — sync regex, ~0ms, no API call. Catches jailbreak phrases like "ignore previous instructions", "you are now", "pretend to be", etc.
2. `checkInputSafety(message)` — Groq `meta-llama/llama-prompt-guard-2-86m`. Returns a numeric injection score as text; `score >= 0.5` is treated as unsafe. NOT deprecated, left untouched by the 2026-08-15 gpt-oss migration.
3. `checkTopicRelevance(message)` — Groq `openai/gpt-oss-20b` (migrated 2026-08-15 from the deprecated `llama-3.1-8b-instant`) as a strict yes/no classifier. Keeps chat scoped to Fabrizio + software dev topics. `maxOutputTokens: 512, temperature: 0`, `providerOptions: { groq: { reasoningFormat: "hidden", reasoningEffort: "low" } }`.
   - gpt-oss-20b is a REASONING model: reasoning tokens are generated before the yes/no answer and consume the
     same budget. The old `maxOutputTokens: 5` (fine for the non-reasoning llama-3.1-8b-instant) caused the model
     to return an EMPTY string (budget exhausted by reasoning, `finish_reason: "length"`). The pre-migration code
     did `text.trim().toLowerCase().startsWith("yes")`, so empty text silently evaluated to "off-topic" and
     blocked the user — contradicting the module's fail-open design. Fixed by treating an empty trimmed response
     as inconclusive and returning `{ safe: true }`, same as the `catch` block.
   - `reasoningEffort: "low"` is fine here (unlike the main chat model, see [[integration_chat]]) — this call has
     no tool calling, just a forced yes/no classification.

**Orchestration:** `runGuardrails(message)` runs injection check first (sync), then safety + relevance in `Promise.all`. All async guards fail open — if Groq is unavailable OR returns an empty completion, request is allowed through.

**Error surface (current, contradicts an older version of this note):** Blocked requests are streamed back via
`createUIMessageStream`/`createUIMessageStreamResponse` in `src/app/api/chat/route.ts` as a `text-start`/
`text-delta`/`text-end` sequence carrying `blockedReason`, NOT a plain-text HTTP 400 body. Verify this against the
route file before trusting the old "plain text 400" claim if it resurfaces elsewhere.

**PR:** https://github.com/chicio/chicio-blog/pull/283 (original three-layer guardrail pipeline)
