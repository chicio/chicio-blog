import { PostsRowContainer } from "@/components/content/blog/posts-row-container";
import { getReadNextPosts } from "@/lib/content/posts/posts";
import { FC } from "react";
import { PostsRow } from "@/components/content/blog/posts-row";

export interface RecentPostsProps {
    currentSlug: string;
}

export const RecentPosts: FC<RecentPostsProps> = ({ currentSlug }) => {
    const readNextPosts = getReadNextPosts(currentSlug);
    return (
        <div className="my-12">
            <h2 className="my-2">Read next</h2>
            <PostsRowContainer>
                <PostsRow postsGroup={readNextPosts} />
            </PostsRowContainer>
        </div>
    );
};
