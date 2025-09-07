"use client";

import { borderRadius } from "@/components/design-system/atoms/effects/border";
import { glassmorphism } from "@/components/design-system/atoms/effects/glassmorphism";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { Author } from "@/types/author";
import { tracking } from "@/types/tracking";
import { motion } from "framer-motion";
import Image from "next/image";
import { FC } from "react";
import styled, { css, TransientProps } from "styled-components";
import { PostAuthors } from "./post-authors";
import { PostMeta } from "./post-meta";
import { PostTags } from "./post-tags";
import { imageShimmerPlaceholder } from "@/components/design-system/atoms/effects/image-shimmer-placeholder";

interface BigCardProps {
  big: boolean;
}

const PostCardContainer = styled(motion.div)<TransientProps<BigCardProps>>`
  ${glassmorphism};
  background-color: ${(props) => props.theme.colors.generalBackgroundLight};
  margin-top: ${(props) => props.theme.spacing[4]};

  ${mediaQuery.minWidth.md} {
    ${(props) =>
      !props.$big &&
      css`
        width: 48%;
      `}
  }
`;

const PostCardImage = styled(Image)`
  width: 100%;
  object-fit: cover;
  height: 200px;
  background-color: ${(props) => props.theme.colors.generalBackground};
  ${borderRadius}

  ${mediaQuery.minWidth.sm} {
    height: 300px;
  }
`;

const BorderedContainer = styled.div`
  border-radius: 20px;
`;

const PostCardLink = styled(StandardInternalLinkWithTracking)`
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

const PostCardMetaContainer = styled.div`
  padding: ${(props) => props.theme.spacing[4]};
`;

export type PostCardProps = BigCardProps & {
  slug: string;
  title: string;
  image: string;
  authors: Author[];
  tags: ReadonlyArray<string | null>;
  date: string;
  readingTime: string;
  description: string;
  trackingCategory: string;
};

export const PostCard: FC<PostCardProps> = ({
  big,
  slug,
  title,
  image,
  authors,
  tags,
  date,
  readingTime,
  description,
  trackingCategory,
}) => (
  <PostCardContainer $big={big} key={slug}>
    <BorderedContainer>
      <PostCardLink
        to={slug}
        trackingData={{
          action: tracking.action.open_blog_post,
          category: trackingCategory,
          label: tracking.label.body,
        }}
      >
        <PostCardImage
          alt={title}
          src={image}
          width={1000}
          height={500}
          placeholder={imageShimmerPlaceholder}
        />
      </PostCardLink>
      <PostCardMetaContainer>
        <PostCardLink
          to={slug}
          trackingData={{
            action: tracking.action.open_blog_post,
            category: trackingCategory,
            label: tracking.label.body,
          }}
        >
          <h3>{title}</h3>
          <PostAuthors
            postAuthors={authors}
            trackingCategory={trackingCategory}
            trackingLabel={tracking.label.body}
            enableUrl={false}
          />
          <PostMeta date={date} readingTime={readingTime} />
          <p className="mx-0 text-shadow-md">{`${description} [...]`}</p>
        </PostCardLink>
        {tags && (
          <PostTags
            tags={tags}
            trackingCategory={tracking.category.blog_home}
            trackingLabel={tracking.label.body}
          />
        )}
      </PostCardMetaContainer>
    </BorderedContainer>
  </PostCardContainer>
);
