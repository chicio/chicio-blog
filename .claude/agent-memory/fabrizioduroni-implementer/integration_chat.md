---
name: Chat Feature Integration
description: Groq LLM + Upstash Vector RAG architecture for the AI chat feature
type: project
---

## Architecture
- Model: Groq `openai/gpt-oss-120b` (migrated 2026-08-15 from `llama-3.3-70b-versatile`, deprecated by Groq 2026-08-16).
  Same `@ai-sdk/groq` provider, no new package — both gpt-oss IDs are in the provider's `GroqChatModelId` union.
- Max tokens: 2000 (raised from 1000 — gpt-oss is a REASONING model: reasoning tokens generate before answer text
  and consume the same output budget), Temperature: 0.5
- `providerOptions: { groq: { reasoningFormat: "hidden" } }` on the `streamText` call suppresses reasoning parts
  from the stream. Required because `sendReasoning` defaults `true` in `ai@7` but the chat UI's part-type switch
  (`src/components/content/chat/chat/chat.tsx`) only handles `text` and the RAG tool part, no default case —
  unhidden reasoning silently renders as an empty bubble. Verified: `reasoningFormat: "hidden"` works with gpt-oss
  despite Groq's docs page saying otherwise, and coexists fine with tool calling.
- Do NOT set `reasoningEffort` on the main chat model: at `low` effort the 120b was observed hallucinating a
  malformed tool name, rejected by Groq with HTTP 400. Leave effort at default.
- `reasoningEffort: "none"` is REJECTED outright by Groq (HTTP 400, "must be one of low, medium, or high") — never
  use it on any gpt-oss call.
- Streaming via `toUIMessageStreamResponse()`
- React hook: `@ai-sdk/react` useChat
- See [[feature_chat_guardrails]] for the topic-relevance gate's parallel migration to `openai/gpt-oss-20b`.

## RAG Pipeline
- Tool: `getFabrizioDuroniBlogKnowledge` registered in API route
- Upstash Vector for semantic search of blog content
- Knowledge upload (`npm run chat-knowledge-upload`): chunks to 800 chars, splits by paragraphs then sentences
- Metadata per chunk: postId, postTitle, postDate, postUrl, postDescription, postTags, postAuthors, chunkIndex

## Key Files
- API route: `src/app/api/chat/route.ts`
- System prompt: `src/lib/chat/llm-prompt.ts`
- Vector client: `src/lib/chat/upstash-vector.ts`
- Knowledge upload: `src/lib/chat/chat-knowledge-upload.ts`
- Chat hook: `src/components/sections/chat/hooks/useFabrizioChat.ts`

## Env Vars
- `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`
