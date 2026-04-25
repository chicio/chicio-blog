import { MCP_SITE_URL } from "@/lib/mcp/config";
import { FC } from "react";

const MCP_URL = `${MCP_SITE_URL}/api/mcp`;

export const McpEndpoint: FC = () => (
    <div className="mb-8 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
        <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-accent/60">Endpoint</span>
        <code className="break-all font-mono text-sm text-accent">{MCP_URL}</code>
    </div>
);
