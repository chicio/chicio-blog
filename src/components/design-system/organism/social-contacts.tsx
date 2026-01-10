import {
  BiLogoDevTo,
  BiLogoFacebookSquare,
  BiLogoGithub,
  BiLogoInstagram,
  BiLogoLinkedin,
  BiLogoMedium,
  BiEnvelope
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { FC } from "react";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { SocialContact } from "../molecules/buttons/social-contact";

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
    <div className="flex justify-center items-center p-0 text-center flex-wrap">
      <SocialContact
        link={links.github}
        trackingAction={tracking.action.open_github}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<BiLogoGithub size={30} title={"Github"} />}
      />
      <SocialContact
        link={links.linkedin}
        trackingAction={tracking.action.open_linkedin}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<BiLogoLinkedin size={30} title={"Linkedin"} />}
      />
      <SocialContact
        link={`mailto:${siteMetadata.contacts.email}`}
        trackingAction={tracking.action.send_mail}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<BiEnvelope size={30} title={"mail"} />}
      />
      <SocialContact
        link={links.medium}
        trackingAction={tracking.action.open_medium}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<BiLogoMedium size={30} title={"Medium"} />}
      />
      <SocialContact
        link={links.devto!}
        trackingAction={tracking.action.open_devto}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<BiLogoDevTo size={30} title={"Devto"} />}
      />
      <SocialContact
        link={links.twitter}
        trackingAction={tracking.action.open_twitter}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<FaXTwitter size={30} title={"Twitter"} />}
      />
      <SocialContact
        link={links.facebook}
        trackingAction={tracking.action.open_facebook}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<BiLogoFacebookSquare size={30} title={"Facebook"} />}
      />
      <SocialContact
        link={links.instagram}
        trackingAction={tracking.action.open_instagram}
        trackingCategory={trackingCategory}
        trackingLabel={trackingLabel}
        icon={<BiLogoInstagram size={30} title={"Instagram"} />}
      />
    </div>
  );
};
