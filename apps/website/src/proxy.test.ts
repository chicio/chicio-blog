import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockTrackMarkdownPageView, mockNextResponseRewrite, mockNextResponseNext } = vi.hoisted(() => ({
    mockTrackMarkdownPageView: vi.fn(),
    mockNextResponseRewrite: vi.fn(),
    mockNextResponseNext: vi.fn(),
}));

vi.mock("@/lib/tracking/measurement-protocol", () => ({
    trackMarkdownPageView: mockTrackMarkdownPageView,
}));

vi.mock("next/server", async () => {
    const actual = await vi.importActual<typeof import("next/server")>("next/server");
    return {
        ...actual,
        NextResponse: {
            ...actual.NextResponse,
            rewrite: mockNextResponseRewrite,
            next: mockNextResponseNext,
        },
    };
});

import { proxy } from "./proxy";
import { NextRequest } from "next/server";

function makeRequest(pathname: string, accept: string = ""): NextRequest {
    const url = `https://www.fabrizioduroni.it${pathname}`;
    const headers: HeadersInit = accept ? { accept } : {};
    return new NextRequest(url, { headers });
}

describe("proxy", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNextResponseRewrite.mockReturnValue({ type: "rewrite" });
        mockNextResponseNext.mockReturnValue({ type: "next" });
    });

    describe("when Accept header includes text/markdown", () => {
        it("calls trackMarkdownPageView with the request pathname", () => {
            const req = makeRequest("/blog/post/2024/01/01/my-post", "text/markdown");
            proxy(req);
            expect(mockTrackMarkdownPageView).toHaveBeenCalledWith("/blog/post/2024/01/01/my-post");
        });

        it("rewrites the URL to prepend /markdown", () => {
            const req = makeRequest("/about-me", "text/markdown");
            proxy(req);
            expect(mockNextResponseRewrite).toHaveBeenCalledTimes(1);
            const rewrittenUrl = mockNextResponseRewrite.mock.calls[0][0] as { pathname: string };
            expect(rewrittenUrl.pathname).toBe("/markdown/about-me");
        });

        it("also handles Accept headers with quality values (q=...)", () => {
            const req = makeRequest("/blog", "text/html, text/markdown;q=0.9");
            proxy(req);
            expect(mockNextResponseRewrite).toHaveBeenCalledTimes(1);
        });
    });

    describe("when Accept header does not include text/markdown", () => {
        it("calls NextResponse.next() for text/html requests", () => {
            const req = makeRequest("/blog", "text/html");
            proxy(req);
            expect(mockNextResponseNext).toHaveBeenCalledTimes(1);
            expect(mockNextResponseRewrite).not.toHaveBeenCalled();
        });

        it("does not call trackMarkdownPageView", () => {
            const req = makeRequest("/blog", "text/html");
            proxy(req);
            expect(mockTrackMarkdownPageView).not.toHaveBeenCalled();
        });

        it("calls NextResponse.next() when Accept header is absent", () => {
            const req = makeRequest("/blog");
            proxy(req);
            expect(mockNextResponseNext).toHaveBeenCalledTimes(1);
        });
    });
});
