import { createMcpServer } from "@/lib/mcp/server";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id",
};

const withCors = (response: Response): Response => {
    const headers = new Headers(response.headers);
    Object.entries(CORS_HEADERS).forEach(([key, value]) => headers.set(key, value));
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
};

const handleMcpRequest = async (req: Request): Promise<Response> => {
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
    });
    const server = createMcpServer();
    await server.connect(transport);
    const response = await transport.handleRequest(req);
    return withCors(response);
};

// GET opens the MCP Streamable HTTP standalone SSE notification stream. This transport is
// constructed with sessionIdGenerator: undefined (stateless mode), so every request gets a fresh
// server/transport pair with no session to correlate server-initiated notifications to: there is
// nothing to push over that stream. The SDK's handleGetRequest has no stateless guard though, so
// delegating GET here would open a stream that never closes and hangs until Vercel's 300s
// serverless timeout kills it. The MCP spec makes this stream optional, so refuse it with 405
// instead: clients handle that by simply not reopening the GET stream.
export async function GET(): Promise<Response> {
    return withCors(
        new Response(
            JSON.stringify({
                error: "This MCP server is stateless and does not offer a standalone SSE stream via GET.",
            }),
            { status: 405, headers: { "Content-Type": "application/json", Allow: "POST, DELETE, OPTIONS" } }
        )
    );
}

export async function POST(req: Request): Promise<Response> {
    return handleMcpRequest(req);
}

export async function DELETE(req: Request): Promise<Response> {
    return handleMcpRequest(req);
}

export async function OPTIONS(): Promise<Response> {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}
