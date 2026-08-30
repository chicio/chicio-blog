import { ImageGlow } from "../../atoms/effects/image-glow";
import type { ImageComponent } from "../../atoms/effects/plain-image";
import { FC } from "react";

const defaultProfilePhoto = "/media/authors/fabrizio-duroni.jpg";

export interface ProfilePhotoProps {
    author: string;
    src?: string;
    imageComponent?: ImageComponent;
}

export const ProfilePhoto: FC<ProfilePhotoProps> = ({ author, src = defaultProfilePhoto, imageComponent }) => (
    <div className="flex items-center justify-center">
        <ImageGlow
            imageComponent={imageComponent}
            className="w-[150px] h-[150px] rounded-full"
            src={src}
            alt={author}
            width={150}
            height={150}
        />
    </div>
);
