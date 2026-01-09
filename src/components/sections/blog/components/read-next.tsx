import { shuffleArray } from "@/components/design-system/utils/hooks/shuffle-array";
import { PostsRowContainer } from "@/components/sections/blog/components/posts-row-container";
import { getPosts } from "@/lib/content/posts";
import { FC } from "react";
import { PostsRow } from "./posts-row";

export interface RecentPostsProps {
  currentSlug: string;
}

export const RecentPosts: FC<RecentPostsProps> = ({ currentSlug }) => {
  const readNextPosts = shuffleArray(
    getPosts().filter(
      (post) => post.slug.formatted !== currentSlug,
    ),
    2
  );

  return (
    <div className="my-12">
      <h2 className="my-2">Read next</h2>
      <PostsRowContainer>
        <PostsRow postsGroup={readNextPosts} />
      </PostsRowContainer>
    </div>
  );
};
