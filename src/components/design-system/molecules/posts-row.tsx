import { FC } from "react";
import styled from "styled-components";
import { mediaQuery } from "../utils-css/media-query";
import { PostCard } from "./post-card";
import {tracking} from "@/types/tracking";
import {Post} from "@/types/post";

const PostsRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${mediaQuery.minWidth.md} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

interface PostsRowProps {
  postsGroup: Post[];
}

export const PostsRow: FC<PostsRowProps> = ({ postsGroup }) => (
  <PostsRowContainer>
    <PostCard
      big={false}
      key={postsGroup[0].frontmatter.slug}
      slug={postsGroup[0].frontmatter.slug}
      title={postsGroup[0].frontmatter.title}
      image={postsGroup[0].frontmatter.image}
      authors={postsGroup[0].frontmatter.authors}
      date={postsGroup[0].frontmatter.date}
      readingTime={postsGroup[0].readingTime.text}
      description={postsGroup[0].frontmatter.description}
      trackingCategory={tracking.category.blog_home}
      tags={postsGroup[0].frontmatter.tags!}
    />
    {postsGroup[1] && (
      <PostCard
        big={false}
        key={postsGroup[1].frontmatter.slug}
        slug={postsGroup[1].frontmatter.slug}
        title={postsGroup[1].frontmatter.title}
        image={postsGroup[1].frontmatter.image}
        authors={postsGroup[1].frontmatter.authors}
        date={postsGroup[1].frontmatter.date}
        readingTime={postsGroup[1].readingTime.text}
        description={postsGroup[1].frontmatter!.description!}
        trackingCategory={tracking.category.blog_home}
        tags={postsGroup[1].frontmatter!.tags!}
      />
    )}
  </PostsRowContainer>
);
