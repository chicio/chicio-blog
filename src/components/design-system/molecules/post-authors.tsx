'use client'

import { FC } from "react";
import styled from "styled-components";
import { ContainerFluid } from "../atoms/container-fluid";
import { Paragraph } from "../atoms/paragraph";
import { mediaQuery } from "../utils-css/media-query";
import Image from 'next/image';
import {Author} from "@/types/author";
import {StandardExternalLinkWithTracking} from "@/components/design-system/atoms/standard-external-link-with-tracking";
import {tracking} from "@/types/tracking";
import {imageBlur} from "@/components/design-system/website/image-blur";

const PostAuthorsContainer = styled(ContainerFluid)`
  padding: 0;
  margin: ${(props) => props.theme.spacing[2]} 0;
  display: flex;
  flex-direction: column;
`;

const PostAuthorContainer = styled(ContainerFluid)`
  padding: 0;
  margin-top: ${(props) => props.theme.spacing[0]};
  display: flex;
  align-items: center;
`;

const PostAuthorImage = styled(Image)`
  margin-right: 5px;
  border-radius: 50%;

  ${mediaQuery.dark} {
    background-color: ${(props) => props.theme.dark.dividerColor};
  }
`;

export interface PostAuthorsProps {
  postAuthors: Author[];
  trackingCategory: string;
  trackingLabel: string;
  enableUrl: boolean;
}

export const PostAuthors: FC<PostAuthorsProps> = ({
  postAuthors,
  trackingCategory,
  trackingLabel,
  enableUrl,
}) =>
    (
        <PostAuthorsContainer>
          {postAuthors.map((author) => {
            return (
                <PostAuthorContainer
                    key={`${author.name}`}
                >
                  <PostAuthorImage
                      alt={author.name}
                      src={author.image}
                      width={30}
                      height={30}
                      placeholder={'blur'}
                      blurDataURL={imageBlur}
                  />
                  <Paragraph>
                    {enableUrl && (
                        <StandardExternalLinkWithTracking
                            trackingData={{
                              action: tracking.action.open_blog_author,
                              category: trackingCategory,
                              label: trackingLabel,
                            }}
                            href={author.url}
                            target={"_blank"}
                            rel="noopener noreferrer"
                        >
                          {author.name}
                        </StandardExternalLinkWithTracking>
                    )}
                    {!enableUrl && author.name}
                  </Paragraph>
                </PostAuthorContainer>
            );
          })}
        </PostAuthorsContainer>
    );
