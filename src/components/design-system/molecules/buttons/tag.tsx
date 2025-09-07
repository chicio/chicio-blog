import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { tracking } from "@/types/tracking";
import { FC } from "react";

interface TagContentProps {
  big: boolean;
}

export type TagProps = TagContentProps & {
  link: string;
  tag: string;
  trackingCategory: string;
  trackingLabel: string;
};

export const Tag: FC<TagProps> = ({
  tag,
  link,
  big,
  trackingCategory,
  trackingLabel,
}) => {
    const textSize = big ? "text-2xl" : "text-sm";
    const margins = big ? "mr-4 mb-6" : "mr-1 mb-1";

    return (
      <StandardInternalLinkWithTracking
        className="inline-block no-underline"
        trackingData={{
          action: tracking.action.open_blog_tag,
          category: trackingCategory,
          label: trackingLabel,
        }}
        to={link}
      >
        <span className={`glow-container text-shadow-sm p-2 ${margins} block text-primary-text ${textSize} leading-none`}>{tag}</span>
      </StandardInternalLinkWithTracking>
    );
  };
