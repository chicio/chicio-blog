import { tracking } from "@/types/tracking";
import { FC } from "react";
import { BluePillLink, RedPillLink } from "../links/pills-links";

export interface PageNavigationProps {
  trackingCategory: string;
  previousPageUrl: string | undefined;
  previousPageTrackingAction: string;
  nextPageUrl: string | undefined;
  nextPageTrackingAction: string;
}

export const PaginationNavigation: FC<PageNavigationProps> = ({
  trackingCategory,
  previousPageUrl,
  previousPageTrackingAction,
  nextPageUrl,
  nextPageTrackingAction,
}) => (
  <div className="flex justify-center gap-5 p-5">
    {previousPageUrl && (
      <BluePillLink
        to={previousPageUrl}
        trackingData={{
          category: trackingCategory,
          label: tracking.label.body,
          action: previousPageTrackingAction,
        }}
      >
        Previous
      </BluePillLink>
    )}
    {nextPageUrl && (
      <RedPillLink
        to={nextPageUrl}
        trackingData={{
          category: trackingCategory,
          label: tracking.label.body,
          action: nextPageTrackingAction,
        }}
      >
        Next
      </RedPillLink>
    )}
  </div>
);
