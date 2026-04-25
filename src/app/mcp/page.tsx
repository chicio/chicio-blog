import { McpPage } from "@/components/sections/mcp/components/mcp-page";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        author: siteMetadata.author,
        title: "MCP Server | Fabrizio Duroni",
        description:
            "Connect any MCP-compatible AI assistant to Fabrizio Duroni's portfolio. Browse blog posts, DSA exercises, and more via the Model Context Protocol.",
        slug: slugs.mcp,
        imageUrl: siteMetadata.featuredImage,
        ogPageType: "website",
    });
}

export default function McpServerPage() {
    return <McpPage />;
}
