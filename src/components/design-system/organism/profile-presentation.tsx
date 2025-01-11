'use client'

import styled from "styled-components";
import { FC } from "react";
import Image from "next/image";
import {CallToActionInternalWithTracking} from "@/components/design-system/atoms/call-to-action-internal-with-tracking";
import {tracking} from "@/types/tracking";
import {slugs} from "@/types/slug";
import {Heading2} from "@/components/design-system/atoms/heading2";
import {mediaQuery} from "@/components/design-system/utils-css/media-query";
import {Heading5} from "@/components/design-system/atoms/heading5";
import {opacity} from "@/components/design-system/utils-css/opacity-keyframes";
import {SocialContacts} from "@/components/design-system/organism/social-contacts";

const Author = styled(Heading2)`
  color: ${(props) => props.theme.light.textAbovePrimaryColor};

  ${mediaQuery.dark} {
    color: ${(props) => props.theme.dark.textAbovePrimaryColor};
  }
`;

const Job = styled(Heading5)`
  color: ${(props) => props.theme.light.textAbovePrimaryColor};

  ${mediaQuery.dark} {
    color: ${(props) => props.theme.dark.textAbovePrimaryColor};
  }
`;

const HomeCallToAction = styled(CallToActionInternalWithTracking)`
  width: 150px;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0;
  animation: ${opacity} 1s linear 0.5s;
  animation-fill-mode: forwards;
`;

export interface ProfilePresentationProps {
  author: string;
}

const ProfilePhoto = styled(Image)`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 3px solid white;
  margin: "auto";
`;

export const ProfilePresentation: FC<ProfilePresentationProps> = ({
  author,
}) => (
  <ProfileContainer>
    <ProfilePhoto src={'/images/authors/fabrizio-duroni.jpg'} alt={author} width={160} height={160} />
    <Author>{author}</Author>
    <Job>Software Developer</Job>
    <SocialContacts
      trackingCategory={tracking.category.home}
      trackingLabel={tracking.label.body}
    />
    <HomeCallToAction
      trackingData={{
        action: tracking.action.open_blog,
        category: tracking.category.home,
        label: tracking.label.body,
      }}
      to={slugs.blog}
    >
      Blog
    </HomeCallToAction>
    <HomeCallToAction
      trackingData={{
        action: tracking.action.open_art,
        category: tracking.category.home,
        label: tracking.label.body,
      }}
      to={slugs.art}
    >
      Art
    </HomeCallToAction>
  </ProfileContainer>
);
