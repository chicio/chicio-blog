import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import { Chip } from "@/components/design-system/atoms/chip";
import { FC } from "react";
import type { PrefetchStrategy } from "@/types/next/prefetch";

interface TagContentProps {
    big: boolean;
}

export type TagProps = TagContentProps & {
    link: string;
    tag: string;
    prefetch?: PrefetchStrategy;
    onClick?: () => void;
};

export const Tag: FC<TagProps> = ({ tag, link, big, onClick, prefetch = "hover" }) => {
    const margins = big ? "mr-4 mb-6" : "mr-1 mb-1";

    return (
        <InternalLink
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
