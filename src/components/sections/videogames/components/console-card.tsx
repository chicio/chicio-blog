import { FC } from "react";
import Image from "next/image";
import { BiCalendar } from "react-icons/bi";
import { tracking } from "@/types/configuration/tracking";
import { IoGameControllerOutline } from "react-icons/io5";
import { BiCart } from "react-icons/bi";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { TerminalLink } from "@/components/design-system/molecules/links/terminal-link";
import { ConsoleMetadata } from "@/types/content/videogames";
import { Content } from "@/types/content/content";
import { ConsoleCardInfoLine } from "./console-card-info-line";

export interface ConsoleCardProps {
  console: Content<ConsoleMetadata>;
  gamesCount: number;
}

export const ConsoleCard: FC<ConsoleCardProps> = ({
  console,
  gamesCount,
}) => (
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
        <div className="border-accent-alpha-40 relative max-h-96 overflow-hidden border-b">
          <Image
            src={console.frontmatter.image}
            alt={console.frontmatter.title}
            width={800}
            height={450}
            className="h-full w-full object-cover"
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
            <h2 className="text-primary font-bold text-shadow-sm">{console.frontmatter.metadata?.name}</h2>
            <div className="text-primary-text mb-2 text-2xl text-shadow-sm">
              {console.frontmatter.metadata?.manufacturer}
            </div>
          </div>
          <div className="space-y-2">
            <ConsoleCardInfoLine 
                icon={<BiCalendar className="text-primary" />}
                label="Released"
                value={console.frontmatter.metadata?.releaseYear}
             />
            <ConsoleCardInfoLine
                icon={<BiCart className="text-primary" />}
                label="Acquired"
                value={console.frontmatter.metadata?.acquiredYear}
             />
            <ConsoleCardInfoLine
                icon={<IoGameControllerOutline className="text-primary" />}
                label="Architecture:"
                value={console.frontmatter.metadata?.bits}
             />
            <ConsoleCardInfoLine
                icon={<BiCart className="text-primary" />}
                label="Generation"
                value={console.frontmatter.metadata?.generation}
             /> 
          </div>
          <p className="mb-4 pt-4">{console.frontmatter.description}</p>
        </StandardInternalLinkWithTracking>
        <TerminalLink
          to={console.slug.formatted}
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