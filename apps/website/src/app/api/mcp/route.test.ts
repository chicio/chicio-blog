import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockConnect, mockHandleRequest, mockCreateMcpServer } = vi.hoisted(() => {
    const mockConnect = vi.fn().mockResolvedValue(undefined);
    const mockHandleRequest = vi.fn();
    const mockCreateMcpServer = vi.fn().mockReturnValue({ connect: mockConnect });

    return { mockConnect, mockHandleRequest, mockCreateMcpServer };
});

vi.mock("@/lib/mcp/server", () => ({
    createMcpServer: mockCreateMcpServer,
}));

vi.mock("@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js", () => {
    class WebStandardStreamableHTTPServerTransport {
        handleRequest: ReturnType<typeof vi.fn>;
        constructor() {
            this.handleRequest = mockHandleRequest;
        }
    }
    return { WebStandardStreamableHTTPServerTransport };
});

import { GET, POST, DELETE, OPTIONS } from "./route";

describe("/api/mcp", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockConnect.mockResolvedValue(undefined);
        mockCreateMcpServer.mockReturnValue({ connect: mockConnect });
        mockHandleRequest.mockResolvedValue(new Response(JSON.stringify({ result: "ok" }), { status: 200 }));
    });

    describe("OPTIONS (preflight)", () => {
        it("returns 204 with CORS headers", async () => {
            const response = await OPTIONS();
            expect(response.status).toBe(204);
            expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
            expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST");
        });

        it("does not create an MCP server", async () => {
            await OPTIONS();
            expect(mockCreateMcpServer).not.toHaveBeenCalled();
        });
    });

    describe("GET", () => {
        it("returns 405 instead of opening the SSE stream", async () => {
            const response = await GET();
            expect(response.status).toBe(405);
        });

        it("advertises the supported methods without GET in the Allow header", async () => {
            const response = await GET();
            const allow = response.headers.get("Allow");
            expect(allow).not.toBeNull();
            expect(allow).not.toContain("GET");
            expect(allow).toContain("POST");
            expect(allow).toContain("DELETE");
            expect(allow).toContain("OPTIONS");
        });

        it("attaches CORS headers to the 405 response", async () => {
            const response = await GET();
            expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
        });

        it("reports the refusal as a JSON-RPC error, matching the shape the SDK uses", async () => {
            const response = await GET();
            expect(response.headers.get("Content-Type")).toBe("application/json");
            await expect(response.json()).resolves.toEqual({
                jsonrpc: "2.0",
                error: {
                    code: -32000,
                    message: "This MCP server is stateless and does not offer a standalone SSE stream via GET.",
                },
                id: null,
            });
        });

        it("does not construct the transport or the MCP server", async () => {
            await GET();
            expect(mockCreateMcpServer).not.toHaveBeenCalled();
            expect(mockConnect).not.toHaveBeenCalled();
            expect(mockHandleRequest).not.toHaveBeenCalled();
        });
    });

    describe("POST", () => {
        it("creates an MCP server and handles the request", async () => {
            const req = new Request("https://www.fabrizioduroni.it/api/mcp", { method: "POST" });
            await POST(req);
            expect(mockCreateMcpServer).toHaveBeenCalledTimes(1);
            expect(mockHandleRequest).toHaveBeenCalledWith(req);
        });

        it("attaches CORS headers to the response", async () => {
            const req = new Request("https://www.fabrizioduroni.it/api/mcp", { method: "POST" });
            const response = await POST(req);
            expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
        });
    });

    describe("DELETE", () => {
        it("creates an MCP server and handles the request", async () => {
            const req = new Request("https://www.fabrizioduroni.it/api/mcp", { method: "DELETE" });
            await DELETE(req);
            expect(mockHandleRequest).toHaveBeenCalledWith(req);
        });

        it("attaches CORS headers to the response", async () => {
            const req = new Request("https://www.fabrizioduroni.it/api/mcp", { method: "DELETE" });
            const response = await DELETE(req);
            expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
        });
    });
});
