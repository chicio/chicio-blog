import { MCP_SITE_URL } from "@/lib/mcp/config";
import { FC } from "react";

const MCP_URL = `${MCP_SITE_URL}/api/mcp`;

export const McpEndpoint: FC = () => (
    <div className="mb-8 flex items-center gap-3 overflow-x-scroll rounded-lg border border-accent bg-accent/5 px-4 py-3">
        <span className="shrink-0 font-mono text-base uppercase tracking-wider text-accent/60">Endpoint</span>
        <code className="whitespace-nowrap font-mono text-base text-accent">{MCP_URL}</code>
    </div>
);
