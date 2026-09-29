import { MatrixBackground } from "matrix-design-system";
import { SiteMenu } from "@/components/features/site-menu";
import { JsonLd } from "@/components/features/seo/jsond-ld";
import { ProfilePresentation } from "./profile-presentation";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { FC } from "react";
import { tracking } from "@/types/configuration/tracking";

export const Homepage: FC = () => {
    return (
        <>
            <SiteMenu trackingCategory={tracking.category.home} />
            <div className="h-screen">
                <MatrixBackground>
                    <ProfilePresentation author={siteMetadata.author} />
                </MatrixBackground>
            </div>
            <JsonLd
                type="Website"
                url={siteMetadata.siteUrl}
                imageUrl={siteMetadata.featuredImage}
                title={siteMetadata.title}
            />
        </>
    );
};
