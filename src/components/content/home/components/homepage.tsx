import { MatrixBackground } from "@/components/design-system/molecules/effects/matrix-background";
import { Menu } from "@/components/design-system/organism/menu";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { ProfilePresentation } from "@/components/content/home/components/profile-presentation";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";

export const Homepage: FC = () => {
  return (
    <>
      <Menu trackingCategory={tracking.category.home} />
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
}
