import { PageTemplate } from "@/components/design-system/templates/page-template";
import { BrandHeader } from "@/components/design-system/organism/header/brand-header";
import { FC, PropsWithChildren, ReactNode } from "react";

export interface ContentPageProps {
    author: string;
    big?: boolean;
    headerWrapper?: FC<PropsWithChildren>;
    onPaletteTrigger?: () => void;
    onTrackNavigation?: (action: string) => void;
    onTrackSocial?: (action: string) => void;
    children?: ReactNode;
}

export const ContentPageTemplate: FC<ContentPageProps> = ({
    children,
    author,
    big = false,
    headerWrapper,
    onPaletteTrigger,
    onTrackNavigation,
    onTrackSocial,
}) => (
    <PageTemplate
        author={author}
        onPaletteTrigger={onPaletteTrigger}
        onTrackNavigation={onTrackNavigation}
        onTrackSocial={onTrackSocial}
        header={<BrandHeader big={big} wrapper={headerWrapper} />}
    >
        {children}
    </PageTemplate>
);
