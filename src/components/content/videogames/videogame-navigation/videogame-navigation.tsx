import { BluePillLink, RedPillLink } from "@/components/design-system/molecules/links/pills-links";
import { FC } from "react";

interface VideogameNavigationProps {
    previous?: {
        url: string;
        title: string;
    };
    next?: {
        url: string;
        title: string;
    };
}

export const VideogameNavigation: FC<VideogameNavigationProps> = ({ previous, next }) => (
    <div className="mt-8 flex flex-row flex-wrap justify-center gap-4">
        {previous && (
            <BluePillLink to={previous.url}>
                {previous.title}
            </BluePillLink>
        )}
        {next && (
            <RedPillLink to={next.url}>
                {next.title}
            </RedPillLink>
        )}
    </div>
);
