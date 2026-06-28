import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("trackMarkdownPageView", () => {
    const mockFetch = vi.fn();

    beforeEach(() => {
        mockFetch.mockReset();
        vi.stubGlobal("fetch", mockFetch);
        mockFetch.mockResolvedValue({ ok: true });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    describe("when GOOGLE_ANALYTICS_API_SECRET is absent", () => {
        it("does not call fetch", async () => {
            vi.stubEnv("GOOGLE_ANALYTICS_API_SECRET", "");

            const { trackMarkdownPageView } = await import("./measurement-protocol");
            trackMarkdownPageView("/blog/post/2024/01/01/my-post");

            expect(mockFetch).not.toHaveBeenCalled();
        });
    });

    describe("when GOOGLE_ANALYTICS_API_SECRET is present", () => {
        it("calls fetch with the GA Measurement Protocol endpoint", async () => {
            vi.stubEnv("GOOGLE_ANALYTICS_API_SECRET", "test-secret");

            const { trackMarkdownPageView } = await import("./measurement-protocol");
            trackMarkdownPageView("/blog/post/2024/01/01/my-post");

            expect(mockFetch).toHaveBeenCalledOnce();
            const [url] = mockFetch.mock.calls[0] as [string, RequestInit];
            expect(url).toContain("google-analytics.com/mp/collect");
            expect(url).toContain("measurement_id=G-B992TEM300");
            expect(url).toContain("api_secret=test-secret");
        });

        it("sends a POST request with a page_view event body", async () => {
            vi.stubEnv("GOOGLE_ANALYTICS_API_SECRET", "test-secret");

            const { trackMarkdownPageView } = await import("./measurement-protocol");
            trackMarkdownPageView("/test-path");

            const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
            expect(init.method).toBe("POST");

            const body = JSON.parse(init.body as string) as {
                client_id: string;
                events: { name: string; params: { page_location: string; content_type: string } }[];
            };
            expect(body.events[0].name).toBe("page_view");
            expect(body.events[0].params.content_type).toBe("markdown");
            expect(body.events[0].params.page_location).toContain("/test-path");
        });

        it("does not throw when fetch rejects", async () => {
            vi.stubEnv("GOOGLE_ANALYTICS_API_SECRET", "test-secret");
            mockFetch.mockRejectedValueOnce(new Error("network error"));

            const { trackMarkdownPageView } = await import("./measurement-protocol");
            await expect(async () => trackMarkdownPageView("/test-path")).not.toThrow();
        });
    });
});
