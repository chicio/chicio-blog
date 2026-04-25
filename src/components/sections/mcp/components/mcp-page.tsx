import McpContent from "@/content/mcp/content.mdx";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { FC } from "react";

export const McpPage: FC = () => (
    <ContentPageTemplate author={siteMetadata.author} trackingCategory={tracking.category.mcp}>
        <div className="mt-3">
            <PageTitle>MCP fabrizioduroni.it</PageTitle>
            <McpContent />
        </div>
    </ContentPageTemplate>
);
