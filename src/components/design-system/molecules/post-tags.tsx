'use client'

import { Tag } from "./tag";
import styled from "styled-components";
import { FC } from "react";
import {generateTagSlug} from "@/lib/tags/tags";

export interface PostTagsProps {
  tags: ReadonlyArray<string | null>;
  trackingCategory: string;
  trackingLabel: string;
}

const PostTagsContainer = styled.div`
  margin: ${(props) => props.theme.spacing[2]} 0;
`;

export const PostTags: FC<PostTagsProps> = ({
  tags,
  trackingCategory,
  trackingLabel,
}) => (
  <PostTagsContainer>
    {tags!.map((tag) => (
      <Tag
        tag={tag!}
        link={generateTagSlug(tag!)}
        big={false}
        key={tag}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
      />
    ))}
  </PostTagsContainer>
);
