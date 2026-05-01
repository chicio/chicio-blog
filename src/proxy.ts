import { trackMarkdownPageView } from "@/lib/tracking/measurement-protocol";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const accept = request.headers.get("accept") ?? "";

    if (accept.includes("text/markdown")) {
        trackMarkdownPageView(request.nextUrl.pathname);
        const url = request.nextUrl.clone();
        url.pathname = `/markdown${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|markdown|api|static|.*\\..*).*)",
    ],
};
