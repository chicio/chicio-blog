import { FC } from "react";
import { PostsRow } from "../molecules/posts-row";
import { getPosts } from "@/lib/posts/posts";
import { PostsRowContainer } from "@/components/design-system/utils/components/posts-row-container";
import { ReadNextTitle } from "@/components/design-system/organism/read-next-title";
import {ContentContainerRecentPosts} from "@/components/design-system/molecules/content-container";
import { shuffleArray } from "../hooks/shuffle-array";

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
