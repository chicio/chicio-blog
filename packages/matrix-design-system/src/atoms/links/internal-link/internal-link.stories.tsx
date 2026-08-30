import type { Meta, StoryObj } from "@storybook/react-vite";
import { InternalLink } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Links/Internal Link",
    component: InternalLink,
};

export default meta;

type Story = StoryObj;

// InternalLink wraps next/link and is unstyled: the accent colour and glow come from the base `a`
// rule in the theme. Single instances go in a flex row so the anchor shrinks to its text instead of
// reading as a full-width bar.
const DefaultStory = () => (
    <div className="flex">
        <InternalLink to="/blog">Read the blog</InternalLink>
    </div>
);

const PostCardTitleStory = () => (
    <div className="glow-container bg-general-background-light max-w-[500px] p-4">
        <InternalLink to="/blog/2026/05/01/build-mcp-server-typescript">
            <h3>Build an MCP server in TypeScript</h3>
        </InternalLink>
        <p className="text-secondary-text mt-2 text-sm">
            How the portfolio exposes its content to AI agents through the Model Context Protocol.
        </p>
    </div>
);

const NavigationRowStory = () => (
    <div className="flex flex-wrap gap-4">
        <InternalLink to="/blog">Blog</InternalLink>
        <InternalLink to="/data-structures-and-algorithms/roadmap">DSA roadmap</InternalLink>
        <InternalLink to="/videogames">Videogames</InternalLink>
        <InternalLink to="/about-me">About me</InternalLink>
        <InternalLink to="/contact">Contact</InternalLink>
    </div>
);

export const Default: Story = { render: () => <DefaultStory /> };
export const PostCardTitle: Story = { render: () => <PostCardTitleStory /> };
export const NavigationRow: Story = { render: () => <NavigationRowStory /> };
