import { ReadingContentPageTemplate, ReadingContentPageProps } from "@/components/design-system/templates/reading-content-page-template";
import { DejavuEasterEgg } from "@/components/features/easter-eggs/dejavu";
import { FC } from "react";

export type { ReadingContentPageProps };

export const ReadingContentPage: FC<ReadingContentPageProps> = (props) => (
    <ReadingContentPageTemplate {...props} headerWrapper={DejavuEasterEgg} />
);
