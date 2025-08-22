import { shuffleArray } from "@/components/design-system/hooks/shuffle-array";
import { ContentContainerRecentPosts } from "@/components/design-system/molecules/content-container";
import { PostsRowContainer } from "@/components/sections/blog/components/posts-row-container";
import { getPosts } from "@/lib/posts/posts";
import { FC } from "react";
import { ReadNextTitle } from "./read-next-title";
import { PostsRow } from "./posts-row";

export interface RecentPostsProps {
  currentSlug: string;
}

export const RecentPosts: FC<RecentPostsProps> = ({ currentSlug }) => {
  const readNextPosts = shuffleArray(
    getPosts().filter(
      (post) => post.frontmatter.slug.formatted !== currentSlug,
    ),
    2
  );

  return (
    <ContentContainerRecentPosts>
      <ReadNextTitle>Read next</ReadNextTitle>
      <PostsRowContainer>
        <PostsRow postsGroup={readNextPosts} />
      </PostsRowContainer>
    </ContentContainerRecentPosts>
  );
};
