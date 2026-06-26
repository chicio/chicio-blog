import { FC } from "react";
import { BluePillLink, RedPillLink } from "@/components/design-system/molecules/links/pills-links";

export interface PageNavigationProps {
    previousPageUrl: string | undefined;
    onTrackPrevious?: () => void;
    nextPageUrl: string | undefined;
    onTrackNext?: () => void;
}

export const PaginationNavigation: FC<PageNavigationProps> = ({
    previousPageUrl,
    onTrackPrevious,
    nextPageUrl,
    onTrackNext,
}) => (
    <div className="flex justify-center gap-5 p-5">
        {previousPageUrl && (
            <BluePillLink to={previousPageUrl} onClick={onTrackPrevious}>
                Previous
            </BluePillLink>
        )}
        {nextPageUrl && (
            <RedPillLink to={nextPageUrl} onClick={onTrackNext}>
                Next
            </RedPillLink>
        )}
    </div>
);
