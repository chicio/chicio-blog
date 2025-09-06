import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { StandardExternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-external-link-with-tracking";
import { imageBlur } from "@/components/design-system/utils/components/image-blur";
import { Author } from "@/types/author";
import { tracking } from "@/types/tracking";
import { FC } from "react";

export interface PostAuthorsProps {
  postAuthors: Author[];
  trackingCategory: string;
  trackingLabel: string;
  enableUrl: boolean;
}

export const PostAuthors: FC<PostAuthorsProps> = ({
  postAuthors,
  trackingCategory,
  trackingLabel,
  enableUrl,
}) => (
  <div className="mx-0 my-4 flex flex-col gap-2 p-0">
    {postAuthors.map((author) => {
      return (
        <div
          className="mt-1 flex items-center gap-2 p-0"
          key={`${author.name}`}
        >
          <ImageGlow
            className="rounded-full"
            alt={author.name}
            src={author.image}
            width={30}
            height={30}
            placeholder={"blur"}
            blurDataURL={imageBlur}
          />
          <p>
            {enableUrl && (
              <StandardExternalLinkWithTracking
                trackingData={{
                  action: tracking.action.open_blog_author,
                  category: trackingCategory,
                  label: trackingLabel,
                }}
                href={author.url}
                target={"_blank"}
                rel="noopener noreferrer"
              >
                {author.name}
              </StandardExternalLinkWithTracking>
            )}
            {!enableUrl && author.name}
          </p>
        </div>
      );
    })}
  </div>
);
