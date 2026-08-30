import { InternalLink } from "@/components/features/design-system-next/internal-link";
import { TerminalListItem } from "matrix-design-system";
import { getReadNextPosts } from "@/lib/content/posts/posts";
import { FC } from "react";
import { ReadNextTerminalWindow } from "./read-next-terminal-window";

export interface RecentPostsProps {
    currentSlug: string;
}

export const RecentPosts: FC<RecentPostsProps> = ({ currentSlug }) => {
    const readNextPosts = getReadNextPosts(currentSlug);
    return (
        <div className="my-12">
            <ReadNextTerminalWindow title="read next">
                {readNextPosts.map((post) => (
                    <InternalLink
                        key={post.slug.formatted}
                        to={post.slug.formatted}
                        className="no-underline hover:no-underline"
                    >
                        <TerminalListItem
                            title={post.frontmatter.title}
                            description={post.frontmatter.description}
                        />
                    </InternalLink>
                ))}
            </ReadNextTerminalWindow>
        </div>
    );
};
