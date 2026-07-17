import { InternalLink } from "@/components/design-system/atoms/links/internal-link";
import { TerminalListItem } from "@/components/design-system/molecules/terminal-list-item";
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
