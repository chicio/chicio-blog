'use client'

import styled, { css, TransientProps } from "styled-components";
import { motion } from "framer-motion";
import { PostAuthors } from "./post-authors";
import { PostMeta } from "./post-meta";
import { FC } from "react";
import { PostTags } from "./post-tags";
import Image from "next/image";
import {StandardInternalLinkWithTracking} from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import {tracking} from "@/types/tracking";
import {Author} from "@/types/author";
import { borderRadius } from "@/components/design-system/atoms/effects/border";
import { glassmorphism } from "@/components/design-system/atoms/effects/glassmorphism";
import { glowText } from "@/components/design-system/atoms/effects/glow";
import { Heading5 } from "@/components/design-system/atoms/typography/heading5";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { Paragraph } from "@/components/design-system/atoms/typography/paragraph";

interface BigCardProps {
  big: boolean;
}

const PostDescription = styled(Paragraph)`
  margin-right: 0;
  margin-left: 0;
  color: ${(props) => props.theme.dark.primaryTextColor};
  opacity: 0.9;
  line-height: 1.5;
  ${glowText}
`;

const PostCardTitle = styled(Heading5)`
  margin: 0 0 ${(props) => props.theme.spacing[2]};
  word-wrap: break-word;
  color: ${(props) => props.theme.dark.accentColor};
`;

const PostCardContainer = styled(motion.div)<TransientProps<BigCardProps>>`
  ${glassmorphism};
  background-color: ${(props) => props.theme.light.generalBackgroundLight};
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
  background-color: ${(props) => props.theme.light.generalBackground};
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
          <PostCardTitle>{title}</PostCardTitle>
          <PostAuthors
            postAuthors={authors}
            trackingCategory={trackingCategory}
            trackingLabel={tracking.label.body}
            enableUrl={false}
          />
          <PostMeta date={date} readingTime={readingTime} />
          <PostDescription>{`${description} [...]`}</PostDescription>
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
