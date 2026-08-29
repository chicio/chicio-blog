import { ExternalLink } from "@/components/design-system/atoms/links/external-link";
import { Author } from "@/types/content/author";
import { FC } from "react";
import { BiGlobe, BiLogoGithub, BiLogoLinkedin } from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

const linkClassName = "glow-container inline-flex items-center gap-2 px-4 py-2 no-underline hover:no-underline";

export interface AuthorSocialsProps {
    author: Author;
}

export const AuthorSocials: FC<AuthorSocialsProps> = ({ author }) => (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <ExternalLink
            className={linkClassName}
            href={author.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
        >
            <BiLogoLinkedin size={20} />
            <span>LinkedIn</span>
        </ExternalLink>
        {author.githubUrl && (
            <ExternalLink
                className={linkClassName}
                href={author.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                <BiLogoGithub size={20} />
                <span>GitHub</span>
            </ExternalLink>
        )}
        {author.xUrl && (
            <ExternalLink
                className={linkClassName}
                href={author.xUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaXTwitter size={18} />
                <span>X</span>
            </ExternalLink>
        )}
        {author.siteUrl && (
            <ExternalLink
                className={linkClassName}
                href={author.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
            >
                <BiGlobe size={20} />
                <span>Website</span>
            </ExternalLink>
        )}
    </div>
);
