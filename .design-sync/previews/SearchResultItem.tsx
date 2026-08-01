import { Command } from "cmdk";
import { SearchResultItem } from "chicio-blog";
import { FC, PropsWithChildren } from "react";

// cmdk auto-highlights the first item of a list, so the resting (unselected) row style is only
// reachable by driving the root with a controlled value that matches no item.
const NOTHING_SELECTED = "no-item-selected";

const PaletteList: FC<PropsWithChildren<{ selected?: string }>> = ({ children, selected }) => (
    <div className="glassmorphism-lite-no-scale w-full max-w-150 overflow-hidden">
        <Command shouldFilter={false} className="flex flex-col" value={selected}>
            <Command.List className="py-2">
                <Command.Group>
                    <div className="text-accent/50 px-4 py-1 font-mono text-xs tracking-wider uppercase">
                        Content
                    </div>
                    {children}
                </Command.Group>
            </Command.List>
        </Command>
    </div>
);

export const Default = () => (
    <PaletteList selected={NOTHING_SELECTED}>
        <SearchResultItem
            title="Building an MCP server for my Next.js blog"
            description="How I built a Model Context Protocol server on top of my Next.js blog, from JSON-RPC transport to Vercel deployment."
            slug="/blog/post/2026/05/01/mcp-server-nextjs"
            onSelect={() => {}}
        />
    </PaletteList>
);

export const Selected = () => (
    <PaletteList selected="Guardrails for LLM chatbots">
        <SearchResultItem
            title="Guardrails for LLM chatbots"
            description="Three layers of protection for the AI chatbot on my portfolio: regex injection detection, Llama Prompt Guard, and an LLM judge."
            slug="/blog/post/2026/04/26/llm-chatbot-guardrails"
            onSelect={() => {}}
        />
    </PaletteList>
);

export const ResultList = () => (
    <PaletteList selected="Number of Islands">
        <SearchResultItem
            title="Graph"
            description="Adjacency lists, BFS and DFS traversal, and the graph problems that build on them."
            slug="/data-structures-and-algorithms/topic/graph"
            onSelect={() => {}}
        />
        <SearchResultItem
            title="Number of Islands"
            description="Count connected components of land in a grid using depth first search."
            slug="/data-structures-and-algorithms/topic/graph/exercise/number-of-islands"
            onSelect={() => {}}
        />
        <SearchResultItem
            title="Building an MCP server for my Next.js blog"
            description="How I gave AI assistants direct access to my content with the Model Context Protocol."
            slug="/blog/post/2026/05/01/mcp-server-nextjs"
            onSelect={() => {}}
        />
    </PaletteList>
);
