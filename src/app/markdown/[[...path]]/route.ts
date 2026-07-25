import { contentRegistry } from "@/lib/content/registry";
import { matchSlugTemplate, pathSegmentsFor } from "@/lib/content/slug-template";
import { notFound } from "next/navigation";

export const dynamic = "force-static";

export async function generateStaticParams() {
    return contentRegistry.flatMap((entry) =>
        (entry.params?.() ?? [{}]).map((params) => {
            const segments = pathSegmentsFor(entry.slug, params);

            return { path: segments.length > 0 ? segments : undefined };
        }),
    );
}

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

type RouteContext = { params: Promise<{ path?: string[] }> };

const markdownFor = (path: string[]): string | null => {
    for (const entry of contentRegistry) {
        const params = matchSlugTemplate(entry.slug, path);

        if (params) {
            return entry.markdown(params);
        }
    }

    return null;
};

export async function GET(_request: Request, { params }: RouteContext) {
    const { path = [] } = await params;
    const markdown = markdownFor(path);

    if (!markdown) {
        notFound();
    }

    return new Response(markdown, {
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "x-markdown-tokens": String(estimateTokens(markdown)),
            "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
