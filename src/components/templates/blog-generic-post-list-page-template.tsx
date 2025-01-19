'use client'

import styled from "styled-components";
import { BlogPageTemplate } from "./blog-page-template";
import {ContainerFluid} from "@/components/design-system/atoms/container-fluid";
import {mediaQuery} from "@/components/design-system/utils-css/media-query";
import {Time} from "@/components/design-system/atoms/time";
import {StandardInternalLinkWithTracking} from "@/components/design-system/atoms/standard-internal-link-with-tracking";
import {PageTitle} from "@/components/design-system/molecules/page-title";
import {FC} from "react";
import {Post} from "@/types/post";
import {tracking} from "@/types/tracking";

const PostContainer = styled(ContainerFluid)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: ${(props) => props.theme.spacing[3]};
  padding-left: 0;
  padding-right: 0;

  ${mediaQuery.minWidth.md} {
    flex-direction: row;
    align-items: center;
  }
`;

interface ColumnProps {
  size: string;
}

const Column = styled.div<ColumnProps>`
  ${mediaQuery.minWidth.md} {
    flex: ${(props) => props.size};
  }
`;

const PostTime = styled(Time)`
  font-size: ${(props) => props.theme.fontSizes[4]};
`;

const PostLink = styled(StandardInternalLinkWithTracking)`
  font-size: ${(props) => props.theme.fontSizes[4]};
`;

export interface BlogGenericPostListPageProps {
  title: string;
  posts: Post[];
  author: string;
  trackingCategory: string;
}

export const BlogGenericPostListPageTemplate: FC<
  BlogGenericPostListPageProps
> = ({
  title,
  posts,
  author,
  trackingCategory,
}) => (
  <BlogPageTemplate
    author={author}
    trackingCategory={trackingCategory}
  >
    <PageTitle>{title}</PageTitle>
    {posts.map((post) => (
      <PostContainer key={post.frontmatter.slug.formatted}>
        <Column size={"15%"}>
          <PostTime>{post.frontmatter.date.formatted}</PostTime>
        </Column>
        <Column size={"85%"}>
          <PostLink
            to={post.frontmatter.slug.formatted}
            trackingData={{
              action: tracking.action.open_blog_post,
              category: trackingCategory,
              label: tracking.label.body,
            }}
          >
            {post.frontmatter.title}
          </PostLink>
        </Column>
      </PostContainer>
    ))}
  </BlogPageTemplate>
);
