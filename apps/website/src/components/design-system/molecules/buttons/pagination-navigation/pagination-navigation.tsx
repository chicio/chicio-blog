import { FC } from "react";
import { BluePillLink, RedPillLink } from "@/components/design-system/molecules/links/pills-links";

export interface PageNavigationProps {
    previousPageUrl: string | undefined;
    onPreviousClick?: () => void;
    nextPageUrl: string | undefined;
    onNextClick?: () => void;
}

export const PaginationNavigation: FC<PageNavigationProps> = ({
    previousPageUrl,
    onPreviousClick,
    nextPageUrl,
    onNextClick,
}) => (
    <div className="flex justify-center gap-5 p-5">
        {previousPageUrl && (
            <BluePillLink to={previousPageUrl} onClick={onPreviousClick}>
                Previous
            </BluePillLink>
        )}
        {nextPageUrl && (
            <RedPillLink to={nextPageUrl} onClick={onNextClick}>
                Next
            </RedPillLink>
        )}
    </div>
);
