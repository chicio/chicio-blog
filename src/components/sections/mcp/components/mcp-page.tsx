import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { CodeBlock } from "@/components/design-system/molecules/code/code-block";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { MCP_SITE_URL } from "@/lib/mcp/config";
import { BiTerminal, BiDesktop, BiGlobe } from "react-icons/bi";
import { FC, ReactNode } from "react";

const MCP_URL = `${MCP_SITE_URL}/api/mcp`;

const CLAUDE_DESKTOP_CONFIG = `{
  "mcpServers": {
    "fabrizioduroni.it": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "${MCP_URL}"]
    }
  }
}`;

interface McpClientCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    children: ReactNode;
}

const McpClientCard: FC<McpClientCardProps> = ({ icon, title, description, children }) => (
    <GlassmorphismBackground className="mb-6">
        <div className="mb-3 flex items-center gap-3">
            <span className="text-accent text-2xl">{icon}</span>
            <h2 className="font-mono text-xl" style={{ marginBottom: 0 }}>
                {title}
            </h2>
        </div>
        <p className="text-primary-text/80 mb-4 text-sm">{description}</p>
        {children}
    </GlassmorphismBackground>
);

const McpCodeBlock: FC<{ code: string }> = ({ code }) => (
    <CodeBlock className="overflow-x-auto rounded-lg border border-accent/20 bg-black/40 p-4 font-mono text-sm text-accent whitespace-pre">
        {code}
    </CodeBlock>
);

export const McpPage: FC = () => (
    <ContentPageTemplate author={siteMetadata.author} trackingCategory={tracking.category.mcp}>
        <div className="mt-3">
            <PageTitle>MCP Server</PageTitle>
            <p className="mb-6">
                This portfolio exposes a public{" "}
                <a
                    href="https://modelcontextprotocol.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline"
                >
                    Model Context Protocol
                </a>{" "}
                server — connect any MCP-compatible AI assistant to browse blog posts, explore DSA
                exercises, search content, and more. No authentication required.
            </p>
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
                <span className="font-mono text-xs text-accent/60 uppercase tracking-wider shrink-0">Endpoint</span>
                <code className="font-mono text-sm text-accent break-all">{MCP_URL}</code>
            </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
            <McpClientCard
                icon={<BiTerminal />}
                title="Claude Code"
                description="From any terminal with Claude Code installed, run:"
            >
                <McpCodeBlock
                    code={`claude mcp add --transport http fabrizioduroni.it ${MCP_URL}`}
                />
                <p className="mt-3 text-xs text-primary-text/60">
                    Use <code className="font-mono text-accent">--scope user</code> to make it available
                    across all your projects.
                </p>
            </McpClientCard>

            <McpClientCard
                icon={<BiDesktop />}
                title="Claude Desktop"
                description={`Add the following to your claude_desktop_config.json. On macOS the file is at ~/Library/Application Support/Claude/claude_desktop_config.json.`}
            >
                <McpCodeBlock code={CLAUDE_DESKTOP_CONFIG} />
                <p className="mt-3 text-xs text-primary-text/60">
                    Requires{" "}
                    <code className="font-mono text-accent">mcp-remote</code> as a stdio↔HTTP bridge.
                    If Node.js is installed in a custom path (e.g. via <code className="font-mono text-accent">n</code> or{" "}
                    <code className="font-mono text-accent">nvm</code>), add an{" "}
                    <code className="font-mono text-accent">{`"env": { "PATH": "/your/node/bin:..." }`}</code>{" "}
                    entry to the server config. Restart Claude Desktop after saving.
                </p>
            </McpClientCard>

            <McpClientCard
                icon={<BiGlobe />}
                title="Claude.ai"
                description="Connect directly from the claude.ai web interface — no config file needed."
            >
                <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm">
                    <li>
                        Open{" "}
                        <a
                            href="https://claude.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline"
                        >
                            claude.ai
                        </a>{" "}
                        → Settings → Connectors
                    </li>
                    <li>
                        Click <strong>Add custom connector</strong>
                    </li>
                    <li>
                        Enter <code className="font-mono text-accent">{MCP_URL}</code>
                    </li>
                </ol>
                <p className="text-xs text-primary-text/60">
                    Custom connectors may be restricted on Enterprise accounts.
                </p>
            </McpClientCard>
        </div>
    </ContentPageTemplate>
);
