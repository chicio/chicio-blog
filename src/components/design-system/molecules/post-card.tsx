'use client'

import styled, { css, TransientProps } from "styled-components";
import { motion } from "framer-motion";
import { Paragraph } from "../atoms/paragraph";
import { PostAuthors } from "./post-authors";
import { PostMeta } from "./post-meta";
import { Heading5 } from "../atoms/heading5";
import { mediaQuery } from "../utils/media-query";
import { FC } from "react";
import { PostTags } from "./post-tags";
import { borderRadius } from "../atoms/border-radius";
import { glassmorphism } from "../atoms/glassmorphism";
import Image from "next/image";
import {StandardInternalLinkWithTracking} from "@/components/design-system/atoms/standard-internal-link-with-tracking";
import {tracking} from "@/types/tracking";
import {Author} from "@/types/author";

interface BigCardProps {
  big: boolean;
}

const PostDescription = styled(Paragraph)`
  margin-right: 0;
  margin-left: 0;
  color: ${(props) => props.theme.dark.primaryTextColor};
  opacity: 0.9;
  line-height: 1.5;
  
  /* Subtle glow per la descrizione */
  text-shadow: 0 0 3px ${(props) => props.theme.dark.accentColor}15;
`;

const PostCardTitle = styled(Heading5)`
  margin: 0 0 ${(props) => props.theme.spacing[2]};
  word-wrap: break-word;
  color: ${(props) => props.theme.dark.accentColor};
  
  /* Matrix glow effect per il titolo */
  text-shadow: 
    0 0 5px ${(props) => props.theme.dark.accentColor}40,
    0 0 10px ${(props) => props.theme.dark.accentColor}20;
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const PostCardContainer = styled(motion.div)<TransientProps<BigCardProps>>`
  ${glassmorphism};
  ${borderRadius};
  background-color: ${(props) => props.theme.light.generalBackgroundLight};
  margin-top: ${(props) => props.theme.spacing[4]};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${mediaQuery.minWidth.md} {
    ${mediaQuery.inputDevice.mouse} {
      &:hover {
        transform: scale(1.025);
        
        /* Intensifica il glow del titolo al hover */
        ${PostCardTitle} {
          text-shadow: 
            0 0 8px ${(props) => props.theme.dark.accentColor}60,
            0 0 15px ${(props) => props.theme.dark.accentColor}30;
        }
      }
    }

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
  border-radius: 4px 4px 0 0;

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
