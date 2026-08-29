import { describe, it, expect } from "vitest";
import { GET, OPTIONS } from "./route";

describe(".well-known/oauth-protected-resource", () => {
    describe("GET", () => {
        it("returns 200 with CORS headers", async () => {
            const response = await GET();
            expect(response.status).toBe(200);
            expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
        });

        it("returns a resource field pointing to the MCP site URL", async () => {
            const response = await GET();
            const body = await response.json() as { resource: string; authorization_servers: string[] };
            expect(body.resource).toBe("https://www.fabrizioduroni.it");
        });

        it("returns an empty authorization_servers array (public, no auth required)", async () => {
            const response = await GET();
            const body = await response.json() as { resource: string; authorization_servers: string[] };
            expect(body.authorization_servers).toEqual([]);
        });
    });

    describe("OPTIONS", () => {
        it("returns 204 with CORS headers", async () => {
            const response = await OPTIONS();
            expect(response.status).toBe(204);
            expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
        });
    });
});
