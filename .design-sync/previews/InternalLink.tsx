import { InternalLink } from "chicio-blog";

// InternalLink wraps next/link and is unstyled: the accent colour and glow come from the base `a`
// rule in the theme. Single instances go in a flex row so the anchor shrinks to its text instead of
// reading as a full-width bar.
export const Default = () => (
    <div className="flex">
        <InternalLink to="/blog">Read the blog</InternalLink>
    </div>
);

export const PostCardTitle = () => (
    <div className="glow-container bg-general-background-light max-w-[500px] p-4">
        <InternalLink to="/blog/2026/05/01/build-mcp-server-typescript">
            <h3>Build an MCP server in TypeScript</h3>
        </InternalLink>
        <p className="text-secondary-text mt-2 text-sm">
            How the portfolio exposes its content to AI agents through the Model Context Protocol.
        </p>
    </div>
);

export const NavigationRow = () => (
    <div className="flex flex-wrap gap-4">
        <InternalLink to="/blog">Blog</InternalLink>
        <InternalLink to="/data-structures-and-algorithms/roadmap">DSA roadmap</InternalLink>
        <InternalLink to="/videogames">Videogames</InternalLink>
        <InternalLink to="/about-me">About me</InternalLink>
        <InternalLink to="/contact">Contact</InternalLink>
    </div>
);
