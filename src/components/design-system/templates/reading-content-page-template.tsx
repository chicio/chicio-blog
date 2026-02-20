import { FC, ReactNode } from "react";
import { ContentProgressBar } from "../organism/reading-content-progress-bar";
import { ContentPageTemplate } from "./content-page-template";
import { BreadcrumbItem } from "../molecules/breadcrumbs/breadcrumb";
import { StickyBreadcrumbWrapper } from "../organism/sticky-breadcrumb";

export interface ContentPageProps {
    author: string;
    trackingCategory: string;
    big?: boolean;
    breadcrumbs?: BreadcrumbItem[];
    beforeContent?: ReactNode;
    children?: ReactNode;
    afterContent?: ReactNode;
}

const contentId = "reading-content-container";

export const ReadingContentPageTemplate: FC<ContentPageProps> = ({
    beforeContent,
    children,
    afterContent,
    author,
    trackingCategory,
    breadcrumbs,
    big = false,
}) => (
    <>
        <ContentProgressBar contentId={contentId} />
        <ContentPageTemplate
            author={author}
            trackingCategory={trackingCategory}
            big={big}
        >
            {breadcrumbs && <StickyBreadcrumbWrapper items={breadcrumbs} />}
            {beforeContent}
            <div id={contentId}>{children}</div>
            {afterContent}
        </ContentPageTemplate>
    </>
);
