---
paths:
  - "src/app/api/**/*"
  - "src/lib/chat/**/*"
  - "src/lib/rate-limit/**/*"
---

# API Route Conventions

## Chat API (`src/app/api/chat/route.ts`)
- Model: Groq `openai/gpt-oss-120b` (reasoning model), max tokens: 2000, temperature: 0.5
- `providerOptions.groq.reasoningFormat: "hidden"` suppresses reasoning parts from the stream (the chat UI only
  handles `text` and `tool-getFabrizioDuroniBlogKnowledge` part types, so unhidden reasoning would render as an
  empty bubble). Reasoning tokens are generated before answer text and count against `maxOutputTokens`.
- RAG tool: `getFabrizioDuroniBlogKnowledge` queries Upstash Vector
- Streaming via `toUIMessageStreamResponse()`
- System prompt defined in `src/lib/chat/llm-prompt.ts`
- Guardrails (`src/lib/chat/guardrails.ts`) topic-relevance check uses Groq `openai/gpt-oss-20b` with
  `reasoningFormat: "hidden"` and `reasoningEffort: "low"`; an empty completion is treated as inconclusive and
  fails open (`safe: true`), matching the module's fail-open design. Input-safety check still uses
  `meta-llama/llama-prompt-guard-2-86m` (not a reasoning model, unaffected by this migration).

## Contact API (`src/app/api/contact/route.ts`)
- Resend API for transactional emails
- Honeypot field for spam protection
- Rate limiting via Upstash Redis (IP-based, `src/lib/rate-limit/rate-limit.ts`)
- Sends both notification (to owner) and confirmation (to user)
- Uses React Email components for templates

## Required Environment Variables
- `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN` (chat RAG)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (rate limiting)
- `RESEND_API_KEY` (email)
- `CONTACT_EMAIL` (contact-form notification recipient; must be set in Vercel Production/Preview or the form send fails at runtime)
