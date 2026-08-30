import NextImage from "next/image";
import { FC } from "react";
import { ProfilePhoto as DesignSystemProfilePhoto, type ProfilePhotoProps } from "matrix-design-system";
export type { ProfilePhotoProps };

/** ProfilePhoto bound to next/image. See design-system-next/image-glow for why this layer exists. */
export const ProfilePhoto: FC<Omit<ProfilePhotoProps, "imageComponent">> = (props) => (
    <DesignSystemProfilePhoto {...props} imageComponent={NextImage} />
);
