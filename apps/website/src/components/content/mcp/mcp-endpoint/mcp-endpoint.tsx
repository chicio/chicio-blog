import { MCP_SITE_URL } from "@/lib/mcp/config";
import { FC } from "react";

const MCP_URL = `${MCP_SITE_URL}/api/mcp`;

export const McpEndpoint: FC = () => (
    <div className="border-accent bg-accent/5 mb-8 flex items-center gap-3 overflow-x-auto rounded-lg border px-4 py-3">
        <span className="text-accent/60 shrink-0 font-mono text-base tracking-wider uppercase">Endpoint</span>
        <code className="text-accent font-mono text-base whitespace-nowrap">{MCP_URL}</code>
    </div>
);
