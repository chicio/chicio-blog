import { useEffect, useRef } from "react";
import { CommandPalette } from "chicio-blog";
import { openCommandPalette } from "@/components/design-system/state/command-palette/command-palette-events";
import type { SearchResult } from "@/types/search/search";

// CommandPalette has no `open` prop: it opens on Cmd/Ctrl+K or on the
// `command-palette-open` event the menu's search button fires. Each cell fires
// that event on mount so the card shows the palette as a reader sees it.
const useOpenedOnMount = (query?: string) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        openCommandPalette();

        if (!query) {
            return;
        }

        // The palette mounts on the next render, so the query is typed one tick
        // later. Going through the native value setter is what makes React (and
        // cmdk underneath it) see a real user edit.
        const timeout = window.setTimeout(() => {
            const input = ref.current?.querySelector("input");
            if (!input) {
                return;
            }
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, query);
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }, 50);

        return () => window.clearTimeout(timeout);
    }, [query]);

    return ref;
};

// The card has no network, so the elasticlunr index behind the real search cannot
// load. `searchEasterEgg` runs before the index lookup and returns a SearchResult,
// so it is used here to hand the palette real published posts — the rendered
// result list is exactly what an index hit produces.
const publishedPosts = (): SearchResult => ({
    type: "search",
    results: [
        {
            slug: "/blog/post/2026/04/26/llm-chatbot-guardrails",
            title: "Guardrails for LLM chatbots: how I protect my chat AI assistant from prompt injection",
            description:
                "A three-layer guardrail system: regex prompt-injection detection, Llama Prompt Guard, and an LLM-as-judge for topic relevance.",
            tags: ["ai", "llm", "typescript"],
            authors: ["fabrizio_duroni"],
        },
        {
            slug: "/blog/post/2026/05/01/mcp-server-nextjs",
            title: "Building an MCP server for my Next.js blog",
            description:
                "The MCP protocol architecture, JSON-RPC transport, capability negotiation, Streamable HTTP and OAuth discovery.",
            tags: ["ai", "mcp", "nextjs"],
            authors: ["fabrizio_duroni"],
        },
        {
            slug: "/blog/post/2026/07/10/software-engineer-skills-pyramid-harness-sdlc",
            title: "The software engineer skills pyramid: how we encoded our own harness",
            description: "How we encoded our software development lifecycle in a set of custom skills and subagents.",
            tags: ["ai", "machine learning", "llm"],
            authors: ["fabrizio_duroni", "davide_botti", "timothy_russo"],
        },
    ],
});

const noEasterEgg = (): SearchResult | null => null;

// The overlay is position:fixed, so the cell root gives it a full-card containing
// block to fill; without one the backdrop collapses to zero height.
const cardHeight = { height: "calc(100vh - 48px)" };

// package-capture screenshots with the page clock frozen (playwright
// clock.setFixedTime), so framer-motion's enter transitions never advance and both
// the backdrop and the panel stay at their initial opacity: 0 — the card came back
// empty. This pins anything still sitting at the initial frame to its settled
// value. It is a capture-harness workaround, not a style decision: nothing else is
// touched because only un-advanced elements carry an inline `opacity: 0;`.
const settledEnterAnimations = `
.ds-motion-settled [style*="opacity: 0;"] {
    opacity: 1 !important;
    transform: none !important;
}
`;

// Opened with no query: the Quick Actions list, which is what Cmd+K shows first.
export const QuickActions = () => {
    const ref = useOpenedOnMount();

    return (
        <div ref={ref} className="ds-motion-settled relative" style={cardHeight}>
            <style>{settledEnterAnimations}</style>
            <CommandPalette
                searchIndexFileName="search-index.json"
                chatSlug="/chat"
                easterEggHuntSlug="/easter-egg-hunt"
                searchEasterEgg={noEasterEgg}
            />
        </div>
    );
};

export const SearchResults = () => {
    const ref = useOpenedOnMount("llm");

    return (
        <div ref={ref} className="ds-motion-settled relative" style={cardHeight}>
            <style>{settledEnterAnimations}</style>
            <CommandPalette
                searchIndexFileName="search-index.json"
                chatSlug="/chat"
                easterEggHuntSlug="/easter-egg-hunt"
                searchEasterEgg={publishedPosts}
            />
        </div>
    );
};

// A query with no match: the palette keeps the terminal framing and answers in it.
export const NoResults = () => {
    const ref = useOpenedOnMount("raytracing on a commodore 64");

    return (
        <div ref={ref} className="ds-motion-settled relative" style={cardHeight}>
            <style>{settledEnterAnimations}</style>
            <CommandPalette
                searchIndexFileName="search-index.json"
                chatSlug="/chat"
                easterEggHuntSlug="/easter-egg-hunt"
                searchEasterEgg={noEasterEgg}
            />
        </div>
    );
};
