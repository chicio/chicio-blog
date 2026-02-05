import { Technology } from "@/content/home/technology";
import Image from "next/image";
import { FC } from "react";

export const TechnologyCard: FC<{ tech: Technology }> = ({
  tech,
}) => {
  return (
    <div
      className="glow-container max-width-[130px] flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-between p-5 sm:max-w-[200px]"
      key={tech.name}
    >
      <Image
        className="object-contain mb-3"
        src={tech.image}
        alt={tech.name}
        placeholder="blur"
        width={60}
        height={60}
      />
      <span className="text-primary-text text-base font-medium">{tech.name}</span>
      <span className="text-secondary text-sm mt-2">{tech.years}</span>
    </div>
  );
};
