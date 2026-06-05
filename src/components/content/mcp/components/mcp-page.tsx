import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import McpContent from "@/content/mcp/content.mdx";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";

export const McpPage: FC = () => (
    <ReadingContentPageTemplate author={siteMetadata.author} trackingCategory={tracking.category.mcp}>
        <McpContent />
    </ReadingContentPageTemplate>
);
