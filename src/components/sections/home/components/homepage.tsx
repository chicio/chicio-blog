import { DownArrowIcon } from "@/components/design-system/atoms/icons/down-arrow-icon";
import { MatrixBackground } from "@/components/design-system/molecules/effects/matrix-background";
import { Menu } from "@/components/design-system/organism/menu";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { ProfilePresentation } from "@/components/sections/home/components/profile-presentation";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";
import { BelowTheFoldContent } from "./below-the-fold-content";

export const Homepage: FC = () => {
  return (
    <>
      <Menu trackingCategory={tracking.category.home} />
      <div className="h-screen">
        <MatrixBackground fontSize={16} density={0.95}>
          <ProfilePresentation author={siteMetadata.author} />
        </MatrixBackground>
        <BelowTheFoldContent />
        <div className="fixed right-0 bottom-3 left-0 z-40 mx-auto my-0 flex items-center justify-center md:bottom-4">
          <DownArrowIcon trackingCategory={tracking.category.home} />
        </div>
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
