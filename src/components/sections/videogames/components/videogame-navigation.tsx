import {
  BluePillLink,
  RedPillLink,
} from "@/components/design-system/molecules/links/pills-links";
import { tracking } from "@/types/configuration/tracking";
import { FC } from "react";

interface VideogameNavigationProps {
  previous?: {
    url: string;
    action: string;
    title: string;
  };
  next?: {
    url: string;
    action: string;
    title: string;
  };
}

export const VideogameNavigation: FC<VideogameNavigationProps> = ({
  previous,
  next,
}) => (
  <div className="mt-8 flex flex-row flex-wrap justify-center gap-4">
    {previous && (
      <BluePillLink
        to={previous.url}
        trackingData={{
          category: tracking.category.videogames,
          label: tracking.label.body,
          action: previous.action,
        }}
      >
        {previous.title}
      </BluePillLink>
    )}
    {next && (
      <RedPillLink
        to={next.url}
        trackingData={{
          category: tracking.category.videogames,
          label: tracking.label.body,
          action: next.action,
        }}
      >
        {next.title}
      </RedPillLink>
    )}
  </div>
);
