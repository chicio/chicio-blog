import { FC } from "react";

export interface PostMetaProps {
  date: string;
  readingTime: string;
}

export const PostMeta: FC<PostMetaProps> = ({ date, readingTime }) => (
  <p className="mt-1 mb-3 mx-0" >
    <time>{date}</time> · <time>{readingTime}</time>
  </p>
);
