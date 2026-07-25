---
name: e2e-chat-sse-mock-framing
description: chat e2e SSE mocks must join events with a blank line (\n\n) or useChat dispatches nothing; and an assertion matching the user's own submitted text is a false-green
metadata:
  type: feedback
---

Two traps that travel together in `e2e/chat.spec.ts`.

**1. SSE mock framing.** The AI SDK's `JsonToSseTransformStream` (see `node_modules/ai/dist/index.mjs`) emits every
part as `` `data: ${JSON.stringify(part)}\n\n` `` — blank-line separated events. A mock built with
`parts.join("\n")` is **not valid SSE**: every `data:` line accumulates into one event that is never dispatched (the
EventSource parser only dispatches on a blank line, and discards an incomplete event at EOF). The chat UI then
renders the user's message and nothing else. Verified empirically: single-`\n` join fails after an 8s timeout;
`parts.join("\n\n") + "\n\n"` renders the reply in ~250ms. The `x-vercel-ai-ui-message-stream: v1` header from
`UI_MESSAGE_STREAM_HEADERS` is *not* required client-side — framing is the whole fix.

**2. The assertion that matches the user's own input.** The spec sends "Tell me about Fabrizio" and used to assert
`getByText("Fabrizio")`. That matched the *echoed user message*, so it was green for years while the mocked stream
never worked. Any `getByText` whose needle is a substring of the text the test just typed proves nothing.

**Why:** a broken mock hidden behind a vacuous assertion means the "mocked stream response renders" coverage claimed
in `.claude/rules/testing.md` did not exist. It only surfaced when an unrelated UI change forced the selector to be
retargeted to the actual reply text.

**How to apply:** when reviewing any change to `e2e/chat.spec.ts` (or any streaming/SSE route mock), check that
(a) events are blank-line separated, and (b) the asserted text comes from the *mocked response*, not from the input
the test typed. If a retargeted assertion goes red, suspect the long-broken mock before suspecting the diff — and
direct the fix at the framing, never back to the vacuous selector.
