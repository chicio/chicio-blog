import { ReadingContentPage } from "@/components/features/reading-content-page";
import McpContent from "@/content/mcp/content.mdx";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";

export const McpPage: FC = () => (
    <ReadingContentPage author={siteMetadata.author} trackingCategory={tracking.category.mcp}>
        <McpContent />
    </ReadingContentPage>
);
