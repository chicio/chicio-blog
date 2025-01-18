import {FC} from "react";
import {useShuffleArray} from "../hooks/use-shuffle-array";
import {PostsRow} from "../molecules/posts-row";
import {getAllPosts} from "@/lib/posts";
import {PostsRowContainer} from "@/components/website/posts-row-container";
import {ReadNextTitle} from "@/components/design-system/organism/read-next-title";

export interface RecentPostsProps {
  currentSlug: string;
}

export const RecentPosts: FC<RecentPostsProps> = ({ currentSlug }) => {
  const readNextPosts = useShuffleArray(
    getAllPosts().filter((post) => post.frontmatter.slug !== currentSlug,),
  ).slice(0, 2);

  return (
    <>
      <ReadNextTitle>Read next</ReadNextTitle>
      <PostsRowContainer>
        <PostsRow postsGroup={readNextPosts} />
      </PostsRowContainer>
    </>
  );
};
