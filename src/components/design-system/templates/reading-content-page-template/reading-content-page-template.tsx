import { FC, PropsWithChildren, ReactNode } from "react";
import { ContentProgressBar } from "@/components/design-system/organism/reading-content-progress-bar";
import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import { Breadcrumb, BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";

export interface ReadingContentPageProps {
    author: string;
    big?: boolean;
    breadcrumbs?: BreadcrumbItem[];
    beforeContent?: ReactNode;
    children?: ReactNode;
    afterContent?: ReactNode;
    headerWrapper?: FC<PropsWithChildren>;
    onPaletteTrigger?: () => void;
    onTrackNavigation?: (action: string) => void;
    onTrackSocial?: (action: string) => void;
}

const contentId = "reading-content-container";

export const ReadingContentPageTemplate: FC<ReadingContentPageProps> = ({
    beforeContent,
    children,
    afterContent,
    author,
    breadcrumbs,
    big = false,
    headerWrapper,
    onPaletteTrigger,
    onTrackNavigation,
    onTrackSocial,
}) => (
    <>
        <ContentProgressBar contentId={contentId} />
        <ContentPageTemplate
            author={author}
            big={big}
            headerWrapper={headerWrapper}
            onPaletteTrigger={onPaletteTrigger}
            onTrackNavigation={onTrackNavigation}
            onTrackSocial={onTrackSocial}
        >
            {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
            {beforeContent}
            <div id={contentId}>{children}</div>
            {afterContent}
        </ContentPageTemplate>
    </>
);
