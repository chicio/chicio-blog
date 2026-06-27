import { FC, PropsWithChildren, ReactNode } from "react";
import { ContentProgressBar } from "@/components/design-system/organism/reading-content-progress-bar";
import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import { Breadcrumb, BreadcrumbItem } from "@/components/design-system/molecules/breadcrumbs/breadcrumb";
import type { ContentPageProps } from "@/components/design-system/templates/content-page-template";

export type ReadingContentPageProps = ContentPageProps & {
    breadcrumbs?: BreadcrumbItem[];
    beforeContent?: ReactNode;
    afterContent?: ReactNode;
    headerWrapper?: FC<PropsWithChildren>;
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
            <div id={contentId}>{children}</div>
            {afterContent}
        </ContentPageTemplate>
    </>
);
