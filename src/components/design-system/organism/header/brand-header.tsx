"use client";

import { MatrixHeaderBackground } from "@/components/design-system/molecules/effects/matrix-header-background";
import { DejavuEasterEgg } from "@/components/sections/easter-eggs/dejavu";
import { FC } from "react";
import logoImage from "../../../../../public/images/logo.png";
import { GlassmorphismBackground } from "../../atoms/effects/glassmorphism-background";
import { ImageGlow } from "../../atoms/effects/image-glow";

interface BrandHeaderProps {
  big: boolean;
}

export const BrandHeader: FC<BrandHeaderProps> = ({ big }) => {
  const height = big ? "h-auto" : "h-[150px] md:h-[180px]";
  const margins = big ? "my-8" : "my-5";

  return (
    <div className={`block ${height}`}>
      <MatrixHeaderBackground big={big} />
      <DejavuEasterEgg>
        <div className={`flex items-center ${margins}`}>
          <GlassmorphismBackground className="w-full">
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <ImageGlow
                src={logoImage}
                alt={"blog logo"}
                width={80}
                height={80}
                placeholder={"blur"}
                className="mr-3 h-[50px] w-[50px] object-cover sm:h-[80px] sm:w-[80px]"
              />
              <div className="flex flex-col justify-start">
                <span className="text-accent m-0 block font-mono font-bold text-2xl sm:text-4xl uppercase text-shadow-lg">CHICIO CODING</span>
                <span className="text-primary-text font-mono text-xs font-normal text-shadow-md sm:text-lg">
                  Pixels. Code. Unplugged.
                </span>
              </div>
            </div>
          </GlassmorphismBackground>
        </div>
      </DejavuEasterEgg>
    </div>
  );
};
