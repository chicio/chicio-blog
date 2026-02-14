import { FC } from "react";
import Image from "next/image";
import { tracking } from "@/types/configuration/tracking";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { TerminalLink } from "@/components/design-system/molecules/links/terminal-link";
import { ConsoleMetadata } from "@/types/content/videogames";
import { Content } from "@/types/content/content";
import { ConsoleTimeInformation } from "./console-time-information";
import { ManufacturerLogo } from "./manufacturer-logo";

export interface ConsoleCardProps {
  console: Content<ConsoleMetadata>;
  gamesCount: number;
}

export const ConsoleCard: FC<ConsoleCardProps> = ({ console, gamesCount }) => (
  <div className="glow-container overflow-hidden">
    <div className="border-accent-alpha-40 bg-general-background-light flex items-center justify-between border-b p-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <span className="text-primary text-4xl font-bold text-shadow-sm sm:text-5xl">
          {console.frontmatter.metadata?.releaseYear}
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
      to={console.slug.formatted}
      trackingData={{
        category: tracking.category.videogames,
        label: tracking.label.body,
        action: tracking.action.open_videogame_console,
      }}
    >
      <div className="border-accent-alpha-40 bg-black relative h-96 flex justify-center items-center overflow-hidden border-b">
        <Image
          src={console.frontmatter.metadata!.logo}
          alt={console.frontmatter.title}
          width={800}
          height={450}
          className="w-full h-96 object-contain p-6"
        />
        <div className="glow-border bg-general-background-light absolute top-4 right-2 flex items-center px-3 py-2">
          <span className="text-primary font-mono text-xs text-shadow-sm">
            {console.frontmatter.metadata?.sku}
          </span>
        </div>
      </div>
    </StandardInternalLinkWithTracking>
    <div className="p-4 sm:p-6">
      <StandardInternalLinkWithTracking
        className="no-underline hover:no-underline"
        to={console.slug.formatted}
        trackingData={{
          category: tracking.category.videogames,
          label: tracking.label.body,
          action: tracking.action.open_videogame_console,
        }}
      >
        <div className="mb-6">
          <h2 className="text-primary font-bold text-shadow-sm">
            {console.frontmatter.metadata?.name}
          </h2>
          <ManufacturerLogo
            logoUrl={console.frontmatter.metadata!.manufacturerLogo}
            name={console.frontmatter.metadata!.manufacturer}
          />
        </div>
        <ConsoleTimeInformation
          releaseYear={console.frontmatter.metadata?.releaseYear}
          acquiredYear={console.frontmatter.metadata?.acquiredYear}
          bits={console.frontmatter.metadata?.bits}
          generation={console.frontmatter.metadata?.generation}
        />
        <p className="mb-4 pt-4">{console.frontmatter.description}</p>
      </StandardInternalLinkWithTracking>
      <TerminalLink
        to={console.slug.formatted}
        trackingData={{
          category: tracking.category.videogames,
          label: tracking.label.body,
          action: tracking.action.open_videogame_console,
        }}
        label="See more"
      />
    </div>
  </div>
);
