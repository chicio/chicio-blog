'use client'

import { FC } from "react";
import { DiscussionEmbed } from "disqus-react";
import styled from "styled-components";

const CommentsContainer = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[7]};

  #thread__container {
    font-family: "Open Sans", Arial, sans-serif;
  }
`;

interface CommentsProps {
    identifier: string;
    url: string;
    title: string;
}

export const Comments: FC<CommentsProps> = ({ identifier, url, title }) => (
  <CommentsContainer>
    <DiscussionEmbed
      shortname={"fabrizio-duroni"}
      config={{ identifier, url, title }}
    />
  </CommentsContainer>
);
