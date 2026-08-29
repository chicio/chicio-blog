import { describe, it, expect } from "vitest";
import { GET, OPTIONS } from "./route";

describe(".well-known/api-catalog", () => {
    describe("GET", () => {
        it("returns a linkset JSON response", async () => {
            const response = await GET();
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toBe("application/linkset+json");
        });

        it("returns CORS headers", async () => {
            const response = await GET();
            expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
        });

        it("linkset contains anchor pointing to the MCP site URL", async () => {
            const response = await GET();
            const body = await response.json() as { linkset: { anchor: string }[] };
            expect(body.linkset[0].anchor).toBe("https://www.fabrizioduroni.it");
        });

        it("linkset contains service-desc entry pointing to /api/mcp", async () => {
            const response = await GET();
            const body = await response.json() as {
                linkset: { "service-desc": { href: string; type: string }[] }[];
            };
            expect(body.linkset[0]["service-desc"][0].href).toContain("/api/mcp");
        });

        it("linkset contains oauth-protected-resource entry", async () => {
            const response = await GET();
            const body = await response.json() as {
                linkset: { "oauth-protected-resource": { href: string }[] }[];
            };
            expect(body.linkset[0]["oauth-protected-resource"][0].href).toContain(
                ".well-known/oauth-protected-resource",
            );
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
