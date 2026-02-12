import VideogamesContent from "../../../../content/videogames/content.mdx";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { getAllConsoles, getAllGames } from "@/lib/content/videogames";
import { MatrixTerminal } from "@/components/design-system/molecules/effects/matrix-terminal";
import {
  BluePillLink,
  RedPillLink,
} from "@/components/design-system/molecules/links/pills-links";
import { slugs } from "@/types/configuration/slug";

export const Videogames: React.FC = () => (
  <ReadingContentPageTemplate
    author={siteMetadata.author}
    trackingCategory={tracking.category.videogames}
  >
    <VideogamesContent />
    <div className="my-8 flex flex-col w-full justify-center items-center">
      <MatrixTerminal
        lines={[
          {
            text: "Scanning the Matrix for video games collections...",
            type: "normal",
            delay: 1000,
          },
          {
            text: "Found it!...",
            type: "success",
            delay: 1200,
          },
          {
            text: "Loading video games collections...",
            type: "normal",
            delay: 1200,
          },
          {
            text: `CONSOLES: ${getAllConsoles().length}, GAMES: ${getAllGames().length}`,
            type: "success",
            delay: 1200,
          },
          {
            text: "Would you like to see more?",
            type: "normal",
            delay: 1200,
          },
        ]}
      />
      <div className="mt-3 flex flex-row gap-4">
        <BluePillLink
          to={'/'}
          trackingData={{
            category: tracking.category.notfound,
            label: tracking.label.body,
            action: tracking.action.blue_pill,
          }}
        >
          Home
        </BluePillLink>
        <RedPillLink
          to={slugs.videogames.collection}
          trackingData={{
            category: tracking.category.notfound,
            label: tracking.label.body,
            action: tracking.action.red_pill,
          }}
        >
          Show Collection
        </RedPillLink>
      </div>
    </div>
    <JsonLd
      type="Website"
      url={siteMetadata.siteUrl}
      imageUrl={siteMetadata.featuredImage}
      title={siteMetadata.title}
    />
  </ReadingContentPageTemplate>
);
