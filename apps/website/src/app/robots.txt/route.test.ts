import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /robots.txt", () => {
    describe("response shape", () => {
        it("returns 200 with text/plain content-type", async () => {
            const response = GET();
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toBe("text/plain; charset=utf-8");
        });

        it("contains User-agent wildcard allow directive", async () => {
            const response = GET();
            const text = await response.text();
            expect(text).toContain("User-agent: *");
            expect(text).toContain("Allow: /");
        });

        it("disallows the /chat path", async () => {
            const response = GET();
            const text = await response.text();
            expect(text).toContain("Disallow: /chat");
        });

        it("includes the sitemap URL", async () => {
            const response = GET();
            const text = await response.text();
            expect(text).toContain("Sitemap:");
            expect(text).toContain("sitemap.xml");
        });

        it("includes the content-signal directive", async () => {
            const response = GET();
            const text = await response.text();
            expect(text).toContain("Content-Signal:");
            expect(text).toContain("ai-train=no");
        });
    });
});
