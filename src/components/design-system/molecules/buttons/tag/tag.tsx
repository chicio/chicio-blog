import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import { Chip } from "@/components/design-system/atoms/chip";
import { FC } from "react";
import type { LinkComponent, PrefetchStrategy } from "@/components/design-system/atoms/links/anchor-link";

interface TagContentProps {
    big: boolean;
}

export type TagProps = TagContentProps & {
    link: string;
    tag: string;
    prefetch?: PrefetchStrategy;
    onClick?: () => void;
    linkComponent?: LinkComponent;
};

export const Tag: FC<TagProps> = ({ tag, link, big, onClick, prefetch = "hover", linkComponent }) => {
    const margins = big ? "mr-4 mb-6" : "mr-1 mb-1";

    return (
        <InternalLink
            linkComponent={linkComponent}
            className="inline-block no-underline"
            onClick={onClick}
            prefetch={prefetch}
            to={link}
        >
            <Chip
                big={big}
                className={margins}
            >
                {tag}
            </Chip>
        </InternalLink>
    );
};
