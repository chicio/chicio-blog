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

export async function GET(req: Request): Promise<Response> {
    return handleMcpRequest(req);
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
