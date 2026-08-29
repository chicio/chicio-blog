import { ReadingContentPage } from "@/components/features/content/reading-content-page";
import CookiePolicyContent from "@/content/cookie-policy/content.mdx";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";

export const CookiePolicy: FC = () => (
    <ReadingContentPage author={siteMetadata.author} trackingCategory={tracking.category.cookie_policy}>
        <CookiePolicyContent />
    </ReadingContentPage>
);
