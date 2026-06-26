import { imageShimmerPlaceholder } from "@/components/design-system/atoms/effects/image-shimmer-placeholder";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { Author } from "@/types/content/author";
import Image from "next/image";
import { FC } from "react";
import { PostAuthors } from "@/components/content/blog/post-authors";
import { PostMeta } from "@/components/content/blog/post-meta";
import { PostTags } from "@/components/content/blog/post-tags";
import { TerminalLink } from "@/components/design-system/molecules/links/terminal-link";

interface BigCardProps {
    big: boolean;
}

export type PostCardProps = BigCardProps & {
    slug: string;
    title: string;
    image: string;
    authors: Author[];
    tags: ReadonlyArray<string | null>;
    date: string;
    readingTime: string;
    description: string;
};

export const PostCard: FC<PostCardProps> = ({
    big,
    slug,
    title,
    image,
    authors,
    tags,
    date,
    readingTime,
    description,
}) => (
    <div
        className={`glow-container bg-general-background-light flex flex-col relative mt-5 ${big ? "w-full" : "w-full md:w-[48%]"}`}
        key={slug}
    >
        <StandardInternalLinkWithTracking to={slug}>
            <Image
                className="bg-general-background h-[200px] w-full rounded-xl object-cover sm:h-[300px]"
                alt={title}
                src={image}
                width={1000}
                height={500}
                placeholder={imageShimmerPlaceholder}
            />
        </StandardInternalLinkWithTracking>
        <div className="flex flex-1 flex-col p-5">
            <StandardInternalLinkWithTracking
                className="no-underline hover:no-underline"
                to={slug}
            >
                <h3 className="mt-0!">{title}</h3>
                <PostAuthors
                    postAuthors={authors}
                    enableUrl={false}
                />
                <PostMeta date={date} readingTime={readingTime} />
                <p className="mx-0 text-shadow-md">{`${description} [...]`}</p>
            </StandardInternalLinkWithTracking>
            {tags && (
                <PostTags tags={tags} />
            )}
        </div>
        <TerminalLink
            className="mt-auto mb-4 mx-5 align-self-start justify-self-start"
            to={slug}
            label="Read more"
        />
    </div>
);
