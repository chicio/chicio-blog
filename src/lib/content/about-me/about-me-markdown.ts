import { getAboutMe } from "@/lib/content/about-me/about-me";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const aboutMeMarkdown = (): string => {
    const aboutMe = getAboutMe();
    const { frontmatter, content } = aboutMe;

    return `# ${frontmatter.title}

> ${frontmatter.description}

**URL:** ${siteMetadata.siteUrl}${slugs.aboutMe}

---

${content}
`;
};
