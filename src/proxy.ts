import { NextRequest, NextResponse } from "next/server";

const MARKDOWN_ACCEPT = "text/markdown";

const MARKDOWN_ROUTES: Record<string, string> = {
    "/": "/markdown-content",
    "/blog": "/markdown-content/blog",
};

const BLOG_POST_PATTERN = /^\/blog\/post\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/?$/;

export function proxy(request: NextRequest) {
    const acceptHeader = request.headers.get("accept") ?? "";

    if (!acceptHeader.includes(MARKDOWN_ACCEPT)) {
        return NextResponse.next();
    }

    const pathname = request.nextUrl.pathname;

    const staticRewrite = MARKDOWN_ROUTES[pathname];
    if (staticRewrite) {
        const url = request.nextUrl.clone();
        url.pathname = staticRewrite;
        return NextResponse.rewrite(url);
    }

    const postMatch = pathname.match(BLOG_POST_PATTERN);
    if (postMatch) {
        const [, year, month, day, slug] = postMatch;
        const url = request.nextUrl.clone();
        url.pathname = `/markdown-content/blog/post/${year}/${month}/${day}/${slug}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/blog",
        "/blog/post/:year/:month/:day/:slug",
    ],
};
