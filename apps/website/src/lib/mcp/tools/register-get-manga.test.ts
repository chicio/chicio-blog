import { describe, it, expect, vi } from "vitest";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGetManga } from "./register-get-manga";
import { registerGetSiteStats } from "./register-get-site-stats";
import { MCP_SITE_URL } from "@/lib/mcp/config";

type Handler = (args: Record<string, unknown>) => Promise<{ content: { text: string }[] }>;

const registerAndCapture = (register: (server: McpServer) => void) => {
    const registerTool = vi.fn();

    register({ registerTool } as unknown as McpServer);

    const [name, config, handler] = registerTool.mock.calls[0];

    return { name, config, handler: handler as Handler };
};

const run = async (handler: Handler, args: Record<string, unknown> = {}) =>
    JSON.parse((await handler(args)).content[0].text);

describe("get_manga", () => {
    it("registers a read-only tool named get_manga with optional author and status filters", () => {
        const { name, config } = registerAndCapture(registerGetManga);

        expect(name).toBe("get_manga");
        expect(Object.keys(config.inputSchema)).toEqual(["author", "status"]);
    });

    it("returns every manga with all its metadata and its public url", async () => {
        const { handler } = registerAndCapture(registerGetManga);

        const result = await run(handler);
        const deathNote = result.find((manga: { title: string }) => manga.title === "Death Note Complete Edition");

        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(deathNote).toMatchObject({
            storyBy: ["Tsugumi Ohba"],
            artBy: ["Takeshi Obata"],
            status: "Completed",
            volumes: 1,
            volumesOwned: 1,
            url: `${MCP_SITE_URL}/manga/death-note`,
        });
    });

    it("filters by story or art author, ignoring case", async () => {
        const { handler } = registerAndCapture(registerGetManga);

        const byStory = await run(handler, { author: "tsugumi ohba" });
        const byArt = await run(handler, { author: "TAKESHI OBATA" });

        expect(byStory.map((manga: { title: string }) => manga.title)).toEqual(["Death Note Complete Edition"]);
        expect(byArt).toEqual(byStory);
    });

    it("filters by status", async () => {
        const { handler } = registerAndCapture(registerGetManga);

        expect((await run(handler, { status: "Completed" })).length).toBeGreaterThanOrEqual(2);
        expect(await run(handler, { status: "Ongoing" })).toEqual([]);
    });
});

describe("get_site_stats", () => {
    it("reports the manga count and the Volumes owned", async () => {
        const { handler } = registerAndCapture(registerGetSiteStats);

        const result = await run(handler);

        expect(result.mangaCount).toBeGreaterThanOrEqual(2);
        expect(result.mangaVolumesOwnedCount).toBeGreaterThanOrEqual(24);
    });
});
