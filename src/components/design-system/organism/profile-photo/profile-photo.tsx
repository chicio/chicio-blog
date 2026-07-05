import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { FC } from "react";

const defaultProfilePhoto = "/media/authors/fabrizio-duroni.jpg";

export const ProfilePhoto: FC<{ author: string; src?: string }> = ({ author, src = defaultProfilePhoto }) => (
    <div className="flex items-center justify-center">
        <ImageGlow
            className="w-[150px] h-[150px] rounded-full"
            src={src}
            alt={author}
            width={150}
            height={150}
            preload
        />
    </div>
);
