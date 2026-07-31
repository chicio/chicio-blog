import { FC, PropsWithChildren, ReactNode } from "react";
import { ContentProgressBar } from "@/components/design-system/organism/reading-content-progress-bar";
import { TableOfContents } from "@/components/design-system/organism/table-of-contents";
import type { TableOfContentsTrackingCallbacks } from "@/components/design-system/organism/table-of-contents";
import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import { Breadcrumb, BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import type { ContentPageProps } from "@/components/design-system/templates/content-page-template";
import type { ContentHeading } from "@/types/content/heading";

export type ReadingContentPageProps = ContentPageProps & {
    breadcrumbs?: BreadcrumbItem[];
    beforeContent?: ReactNode;
    afterContent?: ReactNode;
    headerWrapper?: FC<PropsWithChildren>;
    headings?: ContentHeading[];
    tableOfContentsTracking?: TableOfContentsTrackingCallbacks;
};

const contentId = "reading-content-container";

export const ReadingContentPageTemplate: FC<ReadingContentPageProps> = ({
    beforeContent,
    children,
    afterContent,
    author,
    breadcrumbs,
    big = false,
    headerWrapper,
    navHrefs,
    footerNavHrefs,
    socialLinks,
    onPaletteTrigger,
    menuTracking,
    footerNavTracking,
    footerSocialTracking,
    headings,
    tableOfContentsTracking,
}) => (
    <>
        <ContentProgressBar contentId={contentId} />
        <ContentPageTemplate
            author={author}
            big={big}
            headerWrapper={headerWrapper}
            navHrefs={navHrefs}
            footerNavHrefs={footerNavHrefs}
            socialLinks={socialLinks}
            onPaletteTrigger={onPaletteTrigger}
            menuTracking={menuTracking}
            footerNavTracking={footerNavTracking}
            footerSocialTracking={footerSocialTracking}
        >
            {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
            {beforeContent}
            {headings && headings.length > 0 && (
                <TableOfContents headings={headings} tracking={tableOfContentsTracking} />
            )}
            <div id={contentId}>{children}</div>
            {afterContent}
        </ContentPageTemplate>
    </>
);
