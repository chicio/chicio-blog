---
name: feature_mcp_get_sse_timeout_fix
description: GET /api/mcp SSE stream caused 300s Vercel timeouts; fixed by returning 405
type: project
---

`src/app/api/mcp/route.ts` GET used to delegate to the same `handleMcpRequest` helper as POST/DELETE, which builds
a `WebStandardStreamableHTTPServerTransport` and calls `transport.handleRequest(req)`. In the MCP Streamable HTTP
transport, GET opens a long-lived SSE notification stream. Because the MCP server here is stateless
(`sessionIdGenerator: undefined`, fresh transport/server per request, see [[feature_mcp_server]]), there is no
session to correlate notifications to, so the stream is pure overhead. The SDK's `handleGetRequest` has no
stateless guard and opens the stream unconditionally, so it never closed and hung until Vercel's 300s serverless
ceiling killed the function, at which point clients reconnected and repeated the loop (224+ occurrences from
2026-06-18 onward).

Fix (PR branch `fix/mcp-get-sse-timeout`, 2026-08-15): GET now returns `405 Method Not Allowed` immediately, with
an `Allow: POST, DELETE, OPTIONS` header (deliberately excludes GET) and the same `withCors`/`CORS_HEADERS` reuse
as the other handlers, plus a small JSON body explaining the server is stateless and offers no SSE stream. This is
spec-legal: the MCP Streamable HTTP transport's standalone GET SSE stream is optional, and clients handle a 405 by
not reopening it. `src/lib/mcp/**` was untouched, only the route handler changed.

Verified locally with dev server + curl: GET with `Accept: text/event-stream` returns 405 in well under a second
(no hang); POST with an `initialize` JSON-RPC payload still returns 200 with `serverInfo` in the body as before.

Test file `src/app/api/mcp/route.test.ts` follows a `vi.hoisted()` mock pattern for
`createMcpServer`/`WebStandardStreamableHTTPServerTransport`/`handleRequest`. The regression guard for this fix is
asserting `mockCreateMcpServer`/`mockConnect`/`mockHandleRequest` are NOT called on GET — that's what would fail if
someone reinstated the old delegation.

**Why:** avoid re-diagnosing this if the GET behavior question resurfaces (e.g., someone asks "why doesn't GET
support SSE notifications").
**How to apply:** if MCP ever moves to stateful sessions (real `sessionIdGenerator`), this 405 would need to be
revisited since a real session could then have server-initiated notifications worth streaming.
