import { FC } from "react";

export interface PostMetaProps {
    date: string;
    readingTime: string;
}

export const PostMeta: FC<PostMetaProps> = ({ date, readingTime }) => (
    <p className="mx-0 mt-1 mb-3">
        <time>{date}</time> · <time>{readingTime}</time>
    </p>
);
