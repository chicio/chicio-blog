import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import { FC } from "react";

interface TagContentProps {
    big: boolean;
}

export type TagProps = TagContentProps & {
    link: string;
    tag: string;
    onClick?: () => void;
};

export const Tag: FC<TagProps> = ({ tag, link, big, onClick }) => {
    const textSize = big ? "text-2xl" : "text-sm";
    const margins = big ? "mr-4 mb-6" : "mr-1 mb-1";

    return (
        <InternalLink
            className="inline-block no-underline"
            onClick={onClick}
            to={link}
        >
            <span
                className={`glow-container text-shadow-sm p-2 ${margins} block text-primary-text ${textSize} leading-none`}
            >
                {tag}
            </span>
        </InternalLink>
    );
};
