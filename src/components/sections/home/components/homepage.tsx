import { MatrixBackground } from "@/components/design-system/molecules/effects/matrix-background";
import { Menu } from "@/components/design-system/organism/menu";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { ProfilePresentation } from "@/components/sections/home/components/profile-presentation";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";

export const Homepage: FC = () => {
  return (
    <>
      <Menu trackingCategory={tracking.category.home} />
      <div className="h-screen">
        <MatrixBackground fontSize={16} density={0.95}>
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
