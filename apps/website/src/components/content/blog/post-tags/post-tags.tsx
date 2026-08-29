import { Tag } from "@/components/features/design-system-next/tag";
import { generateTagSlug } from "@/lib/tags/tags";
import { FC } from "react";

export interface PostTagsProps {
    tags: ReadonlyArray<string | null>;
}

export const PostTags: FC<PostTagsProps> = ({ tags }) => (
    <div className="mx-0 my-5">
        {tags!.map((tag) => (
            <Tag
                tag={tag!}
                link={generateTagSlug(tag!)}
                big={false}
                key={tag}
            />
        ))}
    </div>
);
