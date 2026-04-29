import { MCP_SITE_URL } from "@/lib/mcp/config";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(): Promise<Response> {
    return Response.json(
        {
            resource: MCP_SITE_URL,
            authorization_servers: [],
        },
        { headers: CORS_HEADERS },
    );
}

export async function OPTIONS(): Promise<Response> {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}
