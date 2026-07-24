---
paths:
  - "src/app/api/**/*"
  - "src/lib/chat/**/*"
  - "src/lib/rate-limit/**/*"
---

# API Route Conventions

## Chat API (`src/app/api/chat/route.ts`)
- Model: Groq `llama-3.3-70b-versatile`, max tokens: 1000, temperature: 0.5
- RAG tool: `getFabrizioDuroniBlogKnowledge` queries Upstash Vector
- Streaming via `toUIMessageStreamResponse()`
- System prompt defined in `src/lib/chat/llm-prompt.ts`

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
