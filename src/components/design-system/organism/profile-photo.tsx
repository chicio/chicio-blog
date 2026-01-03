import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { FC } from "react";

export const ProfilePhoto: FC<{ author: string }> = ({ author }) => (
  <div className="flex items-center justify-center">
    <ImageGlow
      className="w-[150px] h-[150px] rounded-full"
      src="/images/authors/fabrizio-duroni.jpg"
      alt={author}
      width={150}
      height={150}
      preload
    />
  </div>
);
