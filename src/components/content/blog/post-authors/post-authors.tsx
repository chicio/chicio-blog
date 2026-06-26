import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { StandardExternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-external-link-with-tracking";
import { Author } from "@/types/content/author";
import { FC } from "react";

export interface PostAuthorsProps {
    postAuthors: Author[];
    enableUrl: boolean;
}

export const PostAuthors: FC<PostAuthorsProps> = ({
    postAuthors,
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
                        noPlaceholder={true}
                    />
                    <p>
                        {enableUrl && (
                            <StandardExternalLinkWithTracking
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
