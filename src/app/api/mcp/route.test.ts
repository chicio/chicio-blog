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
        it("creates an MCP server and connects a transport", async () => {
            const req = new Request("https://www.fabrizioduroni.it/api/mcp");
            await GET(req);
            expect(mockCreateMcpServer).toHaveBeenCalledTimes(1);
            expect(mockConnect).toHaveBeenCalledTimes(1);
        });

        it("delegates the request to the transport handler", async () => {
            const req = new Request("https://www.fabrizioduroni.it/api/mcp");
            await GET(req);
            expect(mockHandleRequest).toHaveBeenCalledWith(req);
        });

        it("attaches CORS headers to the response", async () => {
            const req = new Request("https://www.fabrizioduroni.it/api/mcp");
            const response = await GET(req);
            expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
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
