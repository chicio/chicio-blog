import { FC } from "react";
import { Heading4 } from "../atoms/heading4";
import styled from "styled-components";
import { mediaQuery } from "../utils-css/media-query";
import { useShuffleArray } from "../hooks/use-shuffle-array";
import { PostsRow } from "../molecules/posts-row";
import {getAllPosts} from "@/lib/posts";

const ReadNextTitle = styled(Heading4)`
  margin: ${(props) => props.theme.spacing[2]} 0;
`;

const CardsContainer = styled.div`
  display: block;
  width: 100%;

  ${mediaQuery.minWidth.md} {
    display: flex;
    flex-direction: row;
  }
`;

const ReadNextContainer = styled.div`
  margin: ${(props) => props.theme.spacing[4]} 0;
`;

export interface RecentPostsProps {
  currentSlug: string;
}

export const RecentPosts: FC<RecentPostsProps> = ({ currentSlug }) => {

  const readNextPosts = useShuffleArray(
    getAllPosts().filter((post) => post.frontmatter.slug !== currentSlug,),
  ).slice(0, 2);

  return (
    <ReadNextContainer>
      <ReadNextTitle>Read next</ReadNextTitle>
      <CardsContainer>
        <PostsRow postsGroup={readNextPosts} />
      </CardsContainer>
    </ReadNextContainer>
  );
};
