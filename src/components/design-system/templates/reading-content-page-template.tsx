import { FC, PropsWithChildren, ReactNode } from "react";
import { ContentProgressBar } from "../organism/reading-content-progress-bar";
import { ContentPageTemplate } from "./content-page-template";
import { Breadcrumb, BreadcrumbItem } from "../molecules/breadcrumbs/breadcrumb";

export interface ReadingContentPageProps {
    author: string;
    trackingCategory: string;
    big?: boolean;
    breadcrumbs?: BreadcrumbItem[];
    beforeContent?: ReactNode;
    children?: ReactNode;
    afterContent?: ReactNode;
    headerWrapper?: FC<PropsWithChildren>;
}

const contentId = "reading-content-container";

export const ReadingContentPageTemplate: FC<ReadingContentPageProps> = ({
    beforeContent,
    children,
    afterContent,
    author,
    trackingCategory,
    breadcrumbs,
    big = false,
    headerWrapper,
}) => (
    <>
        <ContentProgressBar contentId={contentId} />
        <ContentPageTemplate
            author={author}
            trackingCategory={trackingCategory}
            big={big}
            headerWrapper={headerWrapper}
        >
            {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
            {beforeContent}
            <div id={contentId}>{children}</div>
            {afterContent}
        </ContentPageTemplate>
    </>
);
