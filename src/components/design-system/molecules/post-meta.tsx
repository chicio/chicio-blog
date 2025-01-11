import { FC } from "react";
import styled from "styled-components";
import {Paragraph} from "@/components/design-system/atoms/paragraph";
import {mediaQuery} from "@/components/design-system/utils-css/media-query";
import {Time} from "@/components/design-system/atoms/time";

export interface PostMetaProps {
  date: string;
  readingTime: string;
}

const PostMetaParagraph = styled(Paragraph)`
  margin: ${(props) => props.theme.spacing[0]} 0
    ${(props) => props.theme.spacing[3]} 0;
  color: ${(props) => props.theme.light.secondaryTextColor};

  ${mediaQuery.dark} {
    color: ${(props) => props.theme.dark.secondaryTextColor};
  }
`;

export const PostMeta: FC<PostMetaProps> = ({ date, readingTime }) => (
  <PostMetaParagraph>
    <Time>{date}</Time> · <Time>{readingTime}</Time>
  </PostMetaParagraph>
);
