import { ContentPageTemplate, ContentPageProps } from "@/components/design-system/templates/content-page-template";
import { DejavuEasterEgg } from "@/components/features/easter-eggs/dejavu";
import { FC } from "react";

export type { ContentPageProps };

export const ContentPage: FC<ContentPageProps> = (props) => (
    <ContentPageTemplate {...props} headerWrapper={DejavuEasterEgg} />
);
