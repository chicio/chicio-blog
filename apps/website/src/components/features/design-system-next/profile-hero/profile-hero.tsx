import NextImage from "next/image";
import { FC } from "react";
import { ProfileHero as DesignSystemProfileHero, type ProfileHeroProps } from "matrix-design-system";

export type { ProfileHeroProps };

/** ProfileHero bound to next/image. See design-system-next/image-glow for why this layer exists. */
export const ProfileHero: FC<Omit<ProfileHeroProps, "imageComponent">> = (props) => (
    <DesignSystemProfileHero {...props} imageComponent={NextImage} />
);
