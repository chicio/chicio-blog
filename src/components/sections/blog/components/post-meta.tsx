'use client'

import { FC } from "react";
import styled from "styled-components";
import {Paragraph} from "@/components/design-system/atoms/typography/paragraph";
import {Time} from "@/components/design-system/atoms/typography/time";

export interface PostMetaProps {
  date: string;
  readingTime: string;
}

const PostMetaParagraph = styled(Paragraph)`
  margin: ${(props) => props.theme.spacing[0]} 0
    ${(props) => props.theme.spacing[3]} 0;
`;

export const PostMeta: FC<PostMetaProps> = ({ date, readingTime }) => (
  <PostMetaParagraph>
    <Time>{date}</Time> · <Time>{readingTime}</Time>
  </PostMetaParagraph>
);
