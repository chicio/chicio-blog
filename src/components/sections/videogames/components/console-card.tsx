import { FC } from "react";
import Image from "next/image";
import { BiCalendar } from "react-icons/bi";
import { tracking } from "@/types/configuration/tracking";
import { IoGameControllerOutline } from "react-icons/io5";
import { BiCart } from "react-icons/bi";
import { Button } from "@/components/design-system/atoms/buttons/button";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { TerminalLink } from "@/components/design-system/molecules/links/terminal-link";

export interface ConsoleCardProps {
  year: string;
  id: string;
  gamesCount: number;
  brand: string;
  name: string;
  released: string;
  acquired: string;
  generation: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  bits?: string;
}

const getBitsLabel = (generation: string): string => {
  if (generation === "3rd") return "8-bit";
  if (generation === "4th") return "16-bit";
  if (generation === "5th" || generation === "6th") return "32-bit";
  if (generation === "7th" || generation === "8th" || generation === "9th")
    return "64-bit";
  return "retro";
};

export const ConsoleCard: FC<ConsoleCardProps> = ({
  year,
  id,
  gamesCount,
  brand,
  name,
  released,
  acquired,
  generation,
  description,
  imageSrc,
  imageAlt,
  href,
  bits,
}) => {
  const bitsLabel = bits || getBitsLabel(generation);

  return (
    <div className="glow-container overflow-hidden">
      <div className="border-accent-alpha-40 bg-general-background-light flex items-center justify-between border-b p-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <span className="text-primary text-4xl font-bold text-shadow-sm sm:text-5xl">
            {year}
          </span>
        </div>
        <div className="text-right">
          <div className="text-primary text-2xl font-bold text-shadow-sm sm:text-3xl">
            {gamesCount}
          </div>
          <div className="text-secondary text-xs sm:text-sm">Games owned</div>
        </div>
      </div>
      <StandardInternalLinkWithTracking
      to={href}
          trackingData={{
            category: tracking.category.videogames,
            label: tracking.label.body,
            action: tracking.action.open_videogame_console,
          }}
      >
      <div className="border-accent-alpha-40 relative max-h-96 overflow-hidden border-b">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={800}
          height={450}
          className="h-full w-full object-cover"
        />
        <div className="glow-border flex items-center bg-general-background-light absolute top-4 right-2 px-3 py-2">
          <span className="text-primary font-mono text-xs text-shadow-sm">
            {id}
          </span>
        </div>
      </div>
      </StandardInternalLinkWithTracking>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-primary font-bold text-shadow-sm">{name}</h2>
          <div className="text-secondary mb-2 text-2xl text-shadow-sm">
            {brand}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-primary-text flex items-center gap-2 text-sm sm:text-base">
            <BiCalendar className="text-primary" />
            <span className="text-secondary">Released</span>
            <span>{released}</span>
          </div>
          <div className="text-primary-text flex items-center gap-2 text-sm sm:text-base">
            <BiCart className="text-primary" />
            <span className="text-secondary">Acquired</span>
            <span>{acquired}</span>
          </div>
          <div className="text-primary-text flex items-center gap-2 text-sm sm:text-base">
            <IoGameControllerOutline className="text-primary" />
            <span className="text-secondary">Architecture:</span>
            <span>{bitsLabel}</span>
          </div>
          <div className="text-primary-text flex items-center gap-2 text-sm sm:text-base">
            <BiCart className="text-primary" />
            <span className="text-secondary">Generation</span>
            <span>{generation}</span>
          </div>
        </div>

        <p className="mb-4 pt-4">{description}</p>
        <TerminalLink
          to={href}
          trackingData={{
            category: tracking.category.videogames,
            label: tracking.label.body,
            action: tracking.action.open_videogame_console,
          }}
          label="SEE MORE"
        />
      </div>
    </div>
  );
};
