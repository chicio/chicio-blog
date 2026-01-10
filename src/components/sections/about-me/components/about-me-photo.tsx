"use client";

import { ProfilePhoto } from "@/components/design-system/organism/profile-photo";
import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";
import { siteMetadata } from "@/types/configuration/site-metadata";

export const AboutMePhoto = () => {
  const { glassmorphismClass } = useGlassmorphism();

  return (
    <div className={`my-7 p-4 ${glassmorphismClass}`}>
      <ProfilePhoto author="Fabrizio Duroni" />
      <div className="text-center">
        <h3 className="text-primary-text mx-0 mt-3 text-center">
          {siteMetadata.author}
        </h3>
        <h5 className="text-secondary-text text-center">
          {"Software Engineer"}
        </h5>
      </div>
    </div>
  );
};
