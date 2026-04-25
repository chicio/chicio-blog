import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { ParagraphTitleWithIcon } from "@/components/design-system/molecules/typography/paragraph-title-with-icon";
import { CodeBlock } from "@/components/design-system/molecules/code/code-block";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { MCP_SITE_URL } from "@/lib/mcp/config";
import { BiTerminal, BiDesktop, BiGlobe, BiCode, BiWrench, BiPlug, BiChat } from "react-icons/bi";
import { VscCode } from "react-icons/vsc";
import { FC, ReactNode } from "react";

const MCP_URL = `${MCP_SITE_URL}/api/mcp`;

const CLAUDE_DESKTOP_WINDSURF_CONFIG = `{
  "mcpServers": {
    "fabrizioduroni.it": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "${MCP_URL}"]
    }
  }
}`;

const CURSOR_CONFIG = `{
  "mcpServers": {
    "fabrizioduroni.it": {
      "url": "${MCP_URL}"
    }
  }
}`;

const VSCODE_CONFIG = `{
  "servers": {
    "fabrizioduroni.it": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`;

const TOOLS = [
    {
        name: "search_content",
        params: "query, limit?",
        description: "Full-text search across all blog posts and DSA content.",
    },
    {
        name: "list_posts",
        params: "tag?, limit?",
        description: "List blog posts, optionally filtered by tag slug.",
    },
    {
        name: "get_post",
        params: "year, month, day, slug",
        description: "Retrieve the full content of a single blog post by its date and slug.",
    },
    {
        name: "get_tags",
        params: "—",
        description: "Return all blog tags with their slugs.",
    },
    {
        name: "get_dsa_topics",
        params: "—",
        description: "List all Data Structures & Algorithms topics.",
    },
    {
        name: "get_dsa_exercises",
        params: "topic?, difficulty?",
        description: 'List DSA exercises. Filterable by topic slug and difficulty ("Easy", "Medium", "Hard").',
    },
    {
        name: "get_videogame_consoles",
        params: "—",
        description: "List all consoles in the collection, sorted by release year.",
    },
    {
        name: "get_videogame_games",
        params: "console?, genre?",
        description: "List games in the collection. Filter by console name (from get_videogame_consoles) and/or genre.",
    },
    {
        name: "get_about_me",
        params: "—",
        description: "Return the full About Me page content including professional background and skills.",
    },
    {
        name: "get_site_stats",
        params: "—",
        description: "Aggregate statistics: post count, tag count, DSA topics/exercises, videogame consoles/games, latest post.",
    },
];

interface SectionTitleProps {
    icon: ReactNode;
    children: string;
}

const SectionTitle: FC<SectionTitleProps> = ({ icon, children }) => (
    <h2 className="font-mono text-xl mb-4" style={{ marginBottom: "1rem" }}>
        <ParagraphTitleWithIcon icon={<span className="text-accent text-2xl">{icon}</span>}>
            {children}
        </ParagraphTitleWithIcon>
    </h2>
);

const McpCodeBlock: FC<{ code: string }> = ({ code }) => (
    <CodeBlock className="overflow-x-auto rounded-lg border border-accent/20 bg-black/40 p-4 font-mono text-sm text-accent whitespace-pre">
        {code}
    </CodeBlock>
);

const ConfigPath: FC<{ label: string; path: string }> = ({ label, path }) => (
    <div className="flex items-baseline gap-2">
        <span className="shrink-0 font-mono text-xs text-accent/60 uppercase tracking-wider">{label}</span>
        <code className="font-mono text-xs text-primary-text/70">{path}</code>
    </div>
);

interface ClientCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    children: ReactNode;
}

const ClientCard: FC<ClientCardProps> = ({ icon, title, description, children }) => (
    <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
            <span className="text-accent text-lg">{icon}</span>
            <h3 className="font-mono text-base" style={{ marginBottom: 0 }}>
                {title}
            </h3>
        </div>
        <p className="text-primary-text/70 mb-4 text-sm">{description}</p>
        {children}
    </div>
);

interface UsageExampleData {
    tool: string;
    query: string;
    response: string;
}

const USAGE_EXAMPLES: UsageExampleData[] = [
    {
        tool: "search_content",
        query: "Find blog posts about Metal shaders",
        response: `[
  {
    "slug": "/blog/2018/01/26/the-secret-of-writing-shaders-for-both-apple-metal-and-opengl/",
    "title": "The secret of writing shaders for both Apple Metal and OpenGL",
    "date": "2018-01-26",
    "score": 0.94
  },
  { "slug": "...", "title": "...", "score": 0.87 }
]`,
    },
    {
        tool: "list_posts",
        query: "List the latest blog posts tagged 'swift'",
        response: `[
  { "title": "Swift Structured Concurrency", "date": "2023-06-12",
    "slug": "/blog/2023/06/12/swift-structured-concurrency/", "tags": ["swift"] },
  { "title": "Swift actors", "date": "2023-04-07", "slug": "...", "tags": ["swift"] }
]`,
    },
    {
        tool: "get_post",
        query: "Show me the full Eulerian Circuit post",
        response: `{
  "title": "Eulerian Circuit",
  "date": "2026-04-22",
  "tags": ["dsa", "graph", "algorithm"],
  "content": "An Eulerian circuit is a closed trail that visits every edge of a
graph exactly once...\\n\\n## The algorithm\\n\\nHierholzer's algorithm works
by repeatedly finding cycles and merging them...\\n[truncated]"
}`,
    },
    {
        tool: "get_tags",
        query: "What topics does this blog cover?",
        response: `[
  { "name": "JavaScript", "slug": "javascript" },
  { "name": "Swift",      "slug": "swift" },
  { "name": "React",      "slug": "react" },
  { "name": "Three.js",   "slug": "threejs" }
  // ... 40+ more tags
]`,
    },
    {
        tool: "get_dsa_topics",
        query: "What data structure and algorithm topics are covered?",
        response: `[
  { "name": "Graph",        "slug": "graph",        "exerciseCount": 12 },
  { "name": "Tree",         "slug": "tree",         "exerciseCount": 9 },
  { "name": "Dynamic Prog", "slug": "dynamic-prog", "exerciseCount": 8 }
  // ... more topics
]`,
    },
    {
        tool: "get_dsa_exercises",
        query: "Show me hard graph exercises",
        response: `[
  { "title": "Word Ladder",            "difficulty": "Hard", "topic": "graph" },
  { "title": "Critical Connections",  "difficulty": "Hard", "topic": "graph" },
  { "title": "Alien Dictionary",      "difficulty": "Hard", "topic": "graph" }
]`,
    },
    {
        tool: "get_videogame_consoles",
        query: "What consoles are in your collection?",
        response: `[
  { "name": "Nintendo Entertainment System", "manufacturer": "Nintendo", "releaseYear": 1983 },
  { "name": "Game Boy",                      "manufacturer": "Nintendo", "releaseYear": 1989 },
  { "name": "PlayStation",                   "manufacturer": "Sony",     "releaseYear": 1994 }
  // ... 8 more consoles
]`,
    },
    {
        tool: "get_videogame_games",
        query: "What PlayStation 5 games do you have?",
        response: `[
  { "title": "Astro Bot",                   "genre": "Platform",     "developer": "Team Asobi" },
  { "title": "Final Fantasy VII Rebirth",   "genre": "Role-Playing", "developer": "Square Enix" },
  { "title": "God of War: Ragnarök",        "genre": "Action",       "developer": "Santa Monica" }
  // ... more games
]`,
    },
    {
        tool: "get_about_me",
        query: "Tell me about Fabrizio's professional background",
        response: `{
  "content": "I'm Fabrizio Duroni, a senior software engineer based in Milan.
I work at lastminute.com where I lead mobile and full-stack development...
My passions include 3D graphics, iOS/macOS development, and algorithms.
[truncated — full profile includes skills, experience, and open-source work]"
}`,
    },
    {
        tool: "get_site_stats",
        query: "How much content is on the site?",
        response: `{
  "postsCount":             182,
  "tagsCount":               47,
  "dsaTopicsCount":          13,
  "dsaExercisesCount":       91,
  "videogameConsolesCount":  11,
  "videogameGamesCount":    148,
  "latestPost": {
    "title": "Eulerian Circuit",
    "date":  "2026-04-22",
    "url":   "https://fabrizioduroni.it/blog/2026/04/22/eulerian-circuit/"
  }
}`,
    },
];

const UsageExample: FC<UsageExampleData> = ({ tool, query, response }) => (
    <div className="mb-6">
        <code className="mb-2 block font-mono text-xs text-accent">{tool}</code>
        <p className="mb-2 border-l-2 border-accent/30 pl-3 text-sm italic text-primary-text/70">
            &ldquo;{query}&rdquo;
        </p>
        <McpCodeBlock code={response} />
    </div>
);

export const McpPage: FC = () => (
    <ContentPageTemplate author={siteMetadata.author} trackingCategory={tracking.category.mcp}>
        <div className="mt-3">
            <PageTitle>MCP fabrizioduroni.it</PageTitle>
            <p className="mb-4">
                <a
                    href="https://modelcontextprotocol.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline"
                >
                    Model Context Protocol
                </a>{" "}
                (MCP) is an open standard that lets AI assistants connect to external data sources and
                tools. Instead of copy-pasting content into a chat, you give the AI a direct, structured
                connection to the source.
            </p>
            <p className="mb-6">
                This portfolio exposes a public MCP server — connect your AI assistant to browse blog
                posts, explore DSA exercises, search content, browse the videogame collection, and more.
                No authentication required.
            </p>
            <div className="mb-8 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
                <span className="font-mono text-xs text-accent/60 uppercase tracking-wider shrink-0">
                    Endpoint
                </span>
                <code className="font-mono text-sm text-accent break-all">{MCP_URL}</code>
            </div>
        </div>

        <div className="mb-8">
            <SectionTitle icon={<BiWrench />}>Available Tools</SectionTitle>
            <p className="text-primary-text/70 mb-4 text-sm">
                All tools are read-only and return JSON. Optional parameters are marked with{" "}
                <code className="font-mono text-accent">?</code>.
            </p>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Tool</th>
                            <th>Parameters</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TOOLS.map((tool) => (
                            <tr key={tool.name}>
                                <td>
                                    <code>{tool.name}</code>
                                </td>
                                <td>
                                    <code>{tool.params}</code>
                                </td>
                                <td>{tool.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="mb-8">
            <SectionTitle icon={<BiChat />}>Usage Examples</SectionTitle>
            <p className="text-primary-text/70 mb-4 text-sm">
                Natural language prompts that trigger each tool, with example responses (truncated for
                brevity).
            </p>
            {USAGE_EXAMPLES.map((example) => (
                <UsageExample key={example.tool} {...example} />
            ))}
        </div>

        <div className="mb-8">
            <SectionTitle icon={<BiPlug />}>Connect Your AI Assistant</SectionTitle>

            <ClientCard
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
            </ClientCard>

            <ClientCard
                icon={<BiCode />}
                title="Cursor"
                description="Cursor supports HTTP transport natively — no mcp-remote needed. Open Settings → MCP, or create/edit the config file:"
            >
                <div className="mb-3 flex flex-col gap-1">
                    <ConfigPath label="macOS / Linux" path="~/.cursor/mcp.json" />
                    <ConfigPath label="Windows" path="%APPDATA%\Cursor\mcp.json" />
                </div>
                <McpCodeBlock code={CURSOR_CONFIG} />
            </ClientCard>

            <ClientCard
                icon={<VscCode />}
                title="VS Code + GitHub Copilot"
                description="Requires VS Code ≥ 1.99 with GitHub Copilot in agent mode. Create .vscode/mcp.json in your workspace, or add it to your user-level MCP config:"
            >
                <div className="mb-3 flex flex-col gap-1">
                    <ConfigPath label="Workspace" path=".vscode/mcp.json" />
                    <ConfigPath label="macOS user" path="~/Library/Application Support/Code/User/mcp.json" />
                </div>
                <McpCodeBlock code={VSCODE_CONFIG} />
                <p className="mt-3 text-xs text-primary-text/60">
                    Note the different key names:{" "}
                    <code className="font-mono text-accent">"servers"</code> (not{" "}
                    <code className="font-mono text-accent">"mcpServers"</code>) and{" "}
                    <code className="font-mono text-accent">"type": "http"</code>.
                </p>
            </ClientCard>

            <ClientCard
                icon={<BiDesktop />}
                title="Claude Desktop / Windsurf"
                description="Both apps use the same JSON config format and require mcp-remote as a stdio↔HTTP bridge. Edit the config file for your app:"
            >
                <div className="mb-3 flex flex-col gap-1">
                    <ConfigPath
                        label="Claude Desktop (macOS)"
                        path="~/Library/Application Support/Claude/claude_desktop_config.json"
                    />
                    <ConfigPath label="Windsurf (macOS)" path="~/.codeium/windsurf/mcp_config.json" />
                </div>
                <McpCodeBlock code={CLAUDE_DESKTOP_WINDSURF_CONFIG} />
                <p className="mt-3 text-xs text-primary-text/60">
                    If Node.js is installed in a custom path (e.g. via{" "}
                    <code className="font-mono text-accent">n</code> or{" "}
                    <code className="font-mono text-accent">nvm</code>), add an{" "}
                    <code className="font-mono text-accent">{`"env": { "PATH": "/your/node/bin:..." }`}</code>{" "}
                    entry to the server config. Restart the app after saving.
                </p>
            </ClientCard>

            <ClientCard
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
            </ClientCard>
        </div>
    </ContentPageTemplate>
);
