"use client";

import { ImageGlow } from "@/components/features/design-system-next/image-glow";
import { InternalLink } from "@/components/features/design-system-next/internal-link";
import { Author } from "@/types/content/author";
import { authorHref } from "@/lib/content/authors/author-slug";
import { FC } from "react";
import { usePostAuthorsStore } from "./use-post-authors-store";

export interface PostAuthorsProps {
    postAuthors: Author[];
}

export const PostAuthors: FC<PostAuthorsProps> = ({ postAuthors }) => {
    const { effects } = usePostAuthorsStore();
    const { onClickAuthor } = effects;

    return (
        <div className="mx-0 my-4 flex flex-col gap-2 p-0">
            {postAuthors.map((author) => (
                <div
                    className="mt-1 flex items-center gap-2 p-0"
                    key={author.id}
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
                        <InternalLink
                            to={authorHref(author.id)}
                            onClick={onClickAuthor}
                        >
                            {author.name}
                        </InternalLink>
                    </p>
                </div>
            ))}
        </div>
    );
};
