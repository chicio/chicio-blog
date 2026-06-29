---
name: Chat Feature Integration
description: Groq LLM + Upstash Vector RAG architecture for the AI chat feature
type: project
---

## Architecture
- Model: Groq `llama-3.3-70b-versatile`
- Max tokens: 1000, Temperature: 0.5
- Streaming via `toUIMessageStreamResponse()`
- React hook: `@ai-sdk/react` useChat

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
