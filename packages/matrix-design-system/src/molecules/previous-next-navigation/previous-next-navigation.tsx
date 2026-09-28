import { FC } from "react";
import type { LinkComponent } from "../../atoms/links/anchor-link";
import { BluePillLink, RedPillLink } from "../links/pills-links";

export interface PreviousNextNavigationTarget {
    url: string;
    title: string;
}

export interface PreviousNextNavigationProps {
    previous?: PreviousNextNavigationTarget;
    next?: PreviousNextNavigationTarget;
    linkComponent?: LinkComponent;
}

/**
 * Sibling navigation for a collection item: the blue pill goes back, the red pill goes forward.
 * Either side is omitted when the item has no sibling in that direction.
 */
export const PreviousNextNavigation: FC<PreviousNextNavigationProps> = ({ previous, next, linkComponent }) => (
    <div className="mt-8 flex flex-row flex-wrap justify-center gap-4">
        {previous && (
            <BluePillLink to={previous.url} linkComponent={linkComponent}>
                {previous.title}
            </BluePillLink>
        )}
        {next && (
            <RedPillLink to={next.url} linkComponent={linkComponent}>
                {next.title}
            </RedPillLink>
        )}
    </div>
);
