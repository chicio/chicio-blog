"use client";

import { MatrixHeaderBackground } from "@/components/design-system/molecules/effects/matrix-header-background";
import { DejavuEasterEgg } from "@/components/sections/easter-eggs/dejavu";
import { FC } from "react";
import logoImage from "../../../../../public/images/logo.png";
import { ImageGlow } from "../../atoms/effects/image-glow";
import { useGlassmorphism } from "../../utils/hooks/use-glassmorphism";

interface BrandHeaderProps {
  big: boolean;
}

export const BrandHeader: FC<BrandHeaderProps> = ({ big }) => {
  const { glassmorphismClass } = useGlassmorphism();
  const height = big ? "h-auto" : "h-[150px] md:h-[180px]";
  const margins = big ? "my-8" : "my-5";

  return (
    <div className={`block ${height}`}>
      <MatrixHeaderBackground big={big} />
      <DejavuEasterEgg>
        <div className={`flex items-center ${margins}`}>
          <div className={`${glassmorphismClass} w-full p-5 md:p-9 z-30`}>
            <div className="flex w-full items-center">
              <ImageGlow
                src={logoImage}
                alt={"blog logo"}
                width={80}
                height={80}
                placeholder={"blur"}
                className="mr-3 h-[50px] w-[50px] object-cover sm:h-[80px] sm:w-[80px]"
              />
              <div className="flex flex-col justify-start">
                <span className="text-accent m-0 block font-mono text-2xl font-bold uppercase text-shadow-lg sm:text-4xl">
                  CHICIO CODING
                </span>
                <span className="text-primary-text font-mono text-xs font-normal text-shadow-md sm:text-lg">
                  Pixels. Code. Unplugged.
                </span>
              </div>
            </div>
          </div>
        </div>
      </DejavuEasterEgg>
    </div>
  );
};
