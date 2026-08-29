import { MCP_SITE_URL } from "@/lib/mcp/config";

const CORS_HEADERS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(): Promise<Response> {
    return new Response(
        JSON.stringify({
            linkset: [
                {
                    anchor: MCP_SITE_URL,
                    "service-desc": [
                        {
                            href: `${MCP_SITE_URL}/api/mcp`,
                            type: "application/json",
                        },
                    ],
                    "oauth-protected-resource": [
                        {
                            href: `${MCP_SITE_URL}/.well-known/oauth-protected-resource`,
                            type: "application/json",
                        },
                    ],
                },
            ],
        }),
        {
            headers: {
                "Content-Type": "application/linkset+json",
                ...CORS_HEADERS,
            },
        },
    );
}

export async function OPTIONS(): Promise<Response> {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}
