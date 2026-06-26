import { ContentContainer } from "@/components/design-system/molecules/containers/content-container";
import { Footer } from "@/components/design-system/organism/footer";
import { Menu } from "@/components/design-system/organism/menu";
import { FC, ReactNode } from "react";

export interface BlogPageProps {
    header: React.ReactElement;
    author: string;
    onPaletteTrigger?: () => void;
    onTrackNavigation?: (action: string) => void;
    onTrackSocial?: (action: string) => void;
    children?: ReactNode;
}

export const PageTemplate: FC<BlogPageProps> = ({
    header,
    children,
    author,
    onPaletteTrigger,
    onTrackNavigation,
    onTrackSocial,
}) => (
    <>
        <Menu onPaletteTrigger={onPaletteTrigger} onTrackNavigation={onTrackNavigation} />
        <ContentContainer>
            {header}
            <div className="mt-4">{children}</div>
        </ContentContainer>
        <Footer author={author} onTrackNavigation={onTrackNavigation} onTrackSocial={onTrackSocial} />
    </>
);
