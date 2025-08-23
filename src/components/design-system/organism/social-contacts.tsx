'use client'

import styled from "styled-components";
import {
  DevTo,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Medium,
} from "@styled-icons/boxicons-logos";
import { Twitter } from "@styled-icons/boxicons-logos";
import { Envelope } from "@styled-icons/boxicons-regular";
import { FC } from "react";
import {siteMetadata} from "@/types/site-metadata";
import {tracking} from "@/types/tracking";
import { SocialContact } from "../molecules/buttons/social-contact";

const SocialContactsContainers = styled.div`
  display: flex;
  justify-content: center;
  padding: ${(props) => props.theme.spacing[0]};
  text-align: center;
  flex-wrap: wrap;
`;

export interface SocialContactsProps {
  trackingCategory: string;
  trackingLabel: string;
}

export const SocialContacts: FC<SocialContactsProps> = ({
  trackingCategory,
  trackingLabel,
}) => {
  const links = siteMetadata.contacts.links;

  return (
    <SocialContactsContainers>
      <SocialContact
        link={links.github}
        trackingAction={tracking.action.open_github}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<Github size={30} title={"Github"} />}
      />
      <SocialContact
        link={links.linkedin}
        trackingAction={tracking.action.open_linkedin}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<Linkedin size={30} title={"Linkedin"} />}
      />
      <SocialContact
        link={`mailto:${siteMetadata.contacts.email}`}
        trackingAction={tracking.action.send_mail}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<Envelope size={30} title={"mail"} />}
      />
      <SocialContact
        link={links.medium}
        trackingAction={tracking.action.open_medium}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<Medium size={30} title={"Medium"} />}
      />
      <SocialContact
        link={links.devto!}
        trackingAction={tracking.action.open_devto}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<DevTo size={30} title={"Devto"} />}
      />
      <SocialContact
        link={links.twitter}
        trackingAction={tracking.action.open_twitter}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<Twitter size={30} title={"Twitter"} />}
      />
      <SocialContact
        link={links.facebook}
        trackingAction={tracking.action.open_facebook}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<Facebook size={30} title={"Facebook"} />}
      />
      <SocialContact
        link={links.instagram}
        trackingAction={tracking.action.open_instagram}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<Instagram size={30} title={"Instagram"} />}
      />
    </SocialContactsContainers>
  );
};
