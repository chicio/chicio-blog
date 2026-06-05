import { Tag } from "@/components/design-system/molecules/buttons/tag";
import { generateTagSlug } from "@/lib/tags/tags";
import { FC } from "react";

export interface PostTagsProps {
  tags: ReadonlyArray<string | null>;
  trackingCategory: string;
  trackingLabel: string;
}

export const PostTags: FC<PostTagsProps> = ({
  tags,
  trackingCategory,
  trackingLabel,
}) => (
  <div className="mx-0 my-5">
    {tags!.map((tag) => (
      <Tag
        tag={tag!}
        link={generateTagSlug(tag!)}
        big={false}
        key={tag}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
      />
    ))}
  </div>
);
