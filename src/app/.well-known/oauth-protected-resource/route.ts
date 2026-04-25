import { MCP_SITE_URL } from "@/lib/mcp/config";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * OAuth 2.0 Protected Resource Metadata (RFC 9728).
 * Returning an empty authorization_servers array signals that this MCP server
 * is public and requires no authentication. This satisfies the proactive OAuth
 * discovery performed by clients such as mcp-remote and the MCP Inspector,
 * allowing them to proceed without attempting an OAuth flow.
 */
export async function GET(): Promise<Response> {
    return Response.json(
        {
            resource: `${MCP_SITE_URL}/api/mcp`,
            authorization_servers: [],
        },
        { headers: CORS_HEADERS },
    );
}

export async function OPTIONS(): Promise<Response> {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}
