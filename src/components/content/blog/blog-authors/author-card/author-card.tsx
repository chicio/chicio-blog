"use client";

import { ImageGlow } from "@/components/design-system/atoms/effects/image-glow";
import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import { Author } from "@/types/content/author";
import { FC } from "react";
import { useAuthorCardStore } from "./use-author-card-store";

export interface AuthorCardProps {
    author: Author;
    postCount: number;
    href: string;
}

export const AuthorCard: FC<AuthorCardProps> = ({ author, postCount, href }) => {
    const { effects } = useAuthorCardStore();
    const { onClickAuthor } = effects;

    return (
        <InternalLink
            className="glow-container flex flex-col items-center gap-2 p-6 text-center no-underline hover:no-underline"
            to={href}
            onClick={onClickAuthor}
        >
            <ImageGlow
                className="rounded-full"
                alt={author.name}
                src={author.image}
                width={96}
                height={96}
                noPlaceholder={true}
            />
            <h3 className="mt-2! mb-0!">{author.name}</h3>
            {author.role && <p className="text-secondary-text mt-0!">{author.role}</p>}
            <p className="text-accent mt-1">{postCount} {postCount === 1 ? "post" : "posts"}</p>
        </InternalLink>
    );
};
