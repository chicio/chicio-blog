import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { FC } from "react";

export const ProfilePhoto: FC<{ author: string }> = ({ author }) => (
  <div className="flex items-center justify-center">
    <ImageGlow
      className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full"
      src="/images/authors/fabrizio-duroni.jpg"
      alt={author}
      width={200}
      height={200}
      priority
    />
  </div>
);
